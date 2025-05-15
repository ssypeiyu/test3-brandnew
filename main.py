use_huskylens = False

if use_huskylens:
    huskylens.init_i2c()
    huskylens.init_mode(protocolAlgorithm.OBJECTCLASSIFICATION)



score = 0
score2 = 0
advance_score = 0
is_advanced = False
countdown_limit = 180
advance_time = 120
is_running = False

"""
correct ID check
"""

# ========= 正確圖卡 ID 判斷 =========
def check_image_phase1():
    for id in [1, 2, 3, 4, 5, 6]:
        if huskylens.isAppear_s(id):
            return True
    return False

def check_image_phase2():
    for id in [7, 8, 9, 10, 11]: 
        if huskylens.isAppear_s(id):
            return True
    return False

def check_image_phase3():
    for id in [14, 15, 16]:
        if huskylens.isAppear_s(id):
            return True
    return False

def check_image_phase4():
    for id in [12, 13]:
        if huskylens.isAppear_s(id):
            return True
    return False

"""
wrong ID check
"""
# ========= 錯誤圖卡 ID 判斷 =========
def check_wrong_image_phase1(shown_ids: List[number]) -> bool:
    for id in [7, 8, 9, 10, 11]:
        if huskylens.isAppear_s(id) and not id in shown_ids:
            shown_ids.append(id)
            return True
    return False

def check_wrong_image_phase2(shown_ids: List[number]) -> bool:
    for id in [1, 2, 3, 4, 5, 6]:
        if huskylens.isAppear_s(id) and not id in shown_ids:
            shown_ids.append(id)
            return True
    return False

def check_wrong_image_phase3(shown_ids: List[number]) -> bool:
    for id in [12, 13]:
        if huskylens.isAppear_s(id) and not id in shown_ids:
            shown_ids.append(id)
            return True
    return False

def check_wrong_image_phase4(shown_ids: List[number]) -> bool:
    for id in [14, 15, 16]:
        if huskylens.isAppear_s(id) and not id in shown_ids:
            shown_ids.append(id)
            return True
    return False

# =========第一回合 =========
def display_countdown_phase1(seconds: number):
    shown_wrong_ids: List[number] = []
    tick = 0
    for i in range(seconds, 0, -1):
        basic.show_number(i)
        tick += 1

        if tick % 3 == 0:
            huskylens.request()
            if check_image_phase1():
                basic.show_icon(IconNames.YES)
                global score
                score += 1
                break
            elif check_wrong_image_phase1(shown_wrong_ids):
                music.play_tone(196, music.beat(BeatFraction.EIGHTH))
                basic.show_string("X")

        basic.pause(1000)

# ========= 第二回合 =========
def display_countdown_phase2(seconds: number):
    shown_wrong_ids: List[number] = []
    tick = 0
    for i in range(seconds, 0, -1):
        basic.show_number(i)
        tick += 1

        if tick % 3 == 0:
            huskylens.request()
            if check_image_phase2():
                basic.show_icon(IconNames.YES)
                global score2
                score2 += 1
                break
            elif check_wrong_image_phase2(shown_wrong_ids):
                music.play_tone(196, music.beat(BeatFraction.EIGHTH))
                basic.show_string("X")

        basic.pause(1000)

# ========= 進階挑戰 =========
def display_advance_challenge(total_seconds: number):
    shown_wrong_ids: List[number] = []
    tick = 0
    question = 1
    correct_count = 0

    for i in range(total_seconds, 0, -1):
        basic.show_number(i)
        tick += 1

        if tick % 3 == 0:
            huskylens.request()

            if check_image_phase3():
                basic.show_icon(IconNames.YES)
                global advance_score
                advance_score += 5
                correct_count += 1
                question += 1

                if correct_count >= 5:
                    break

            else: #後三題
                if question <= 3:
                    if check_wrong_image_phase3(shown_wrong_ids):
                        music.play_tone(196, music.beat(BeatFraction.EIGHTH))
                        basic.show_string("X")
                else:
                    if check_wrong_image_phase4(shown_wrong_ids):
                        music.play_tone(196, music.beat(BeatFraction.EIGHTH))
                        basic.show_string("X")

        basic.pause(1000)




# ========= 第一階段 (A鍵) =========
def start_quiz():
    global is_advanced, score
    is_advanced = False
    score = 0
    display_countdown_phase1(countdown_limit)
    basic.clear_screen()
    basic.show_string("Score:")
    basic.show_number(score)

# ========= 第二階段 (B鍵) =========
def start_quiz2():
    global is_advanced, score2
    is_advanced = False
    score2 = 0
    display_countdown_phase2(countdown_limit)
    basic.clear_screen()
    basic.show_string("Score2:")
    basic.show_number(score + score2)

# ========= 進階挑戰階段 (A+B鍵) =========
def start_advanced():
    global is_advanced, advance_score
    is_advanced = True
    advance_score = 0
    display_advance_challenge(advance_time)
    basic.clear_screen()
    basic.show_string("AdvScore:")
    basic.show_number(advance_score)
    basic.show_string("Total:")
    basic.show_number(score + score2 + advance_score)

# ========= 按鍵事件 =========
def on_button_pressed_a():
    global is_running
    if is_running:
        return
    is_running = True
    basic.clear_screen()
    start_text = "START!"
    start_tones = [262, 294, 330, 349, 392, 440]
    for i in range(len(start_text)):
        basic.show_string(start_text[i])
        music.play_tone(start_tones[i], music.beat(BeatFraction.EIGHTH))
        basic.pause(100)
    basic.pause(500)
    start_quiz()
    is_running = False

def on_button_pressed_b():
    global is_running
    if is_running:
        return
    is_running = True
    basic.clear_screen()
    start_text = "START!"
    start_tones = [262, 294, 330, 349, 392, 440]
    for i in range(len(start_text)):
        basic.show_string(start_text[i])
        music.play_tone(start_tones[i], music.beat(BeatFraction.EIGHTH))
        basic.pause(100)
    basic.pause(500)
    start_quiz2()
    is_running = False

def on_button_pressed_ab():
    global is_running
    if is_running:
        return
    is_running = True
    basic.clear_screen()
    adv_text = "START!"
    adv_tones = [220, 196, 175, 165]
    for i in range(len(adv_text)):
        basic.show_string(adv_text[i])
        music.play_tone(adv_tones[i], music.beat(BeatFraction.EIGHTH))
        basic.pause(100)
    basic.pause(500)
    start_advanced()
    is_running = False

input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)
input.on_button_pressed(Button.AB, on_button_pressed_ab)
