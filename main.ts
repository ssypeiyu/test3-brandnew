let use_huskylens = false
if (use_huskylens) {
    huskylens.initI2c()
    huskylens.initMode(protocolAlgorithm.OBJECTCLASSIFICATION)
}

let score = 0
let score2 = 0
let advance_score = 0
let is_advanced = false
let countdown_limit = 180
let advance_time = 120
let is_running = false
/** correct ID check */
//  ========= 正確圖卡 ID 判斷 =========
function check_image_phase1(): boolean {
    for (let id of [1, 2, 3, 4, 5, 6]) {
        if (huskylens.isAppear_s(id)) {
            return true
        }
        
    }
    return false
}

function check_image_phase2(): boolean {
    for (let id of [7, 8, 9, 10, 11]) {
        if (huskylens.isAppear_s(id)) {
            return true
        }
        
    }
    return false
}

function check_image_phase3(): boolean {
    for (let id of [14, 15, 16]) {
        if (huskylens.isAppear_s(id)) {
            return true
        }
        
    }
    return false
}

function check_image_phase4(): boolean {
    for (let id of [12, 13]) {
        if (huskylens.isAppear_s(id)) {
            return true
        }
        
    }
    return false
}

/** wrong ID check */
//  ========= 錯誤圖卡 ID 判斷 =========
function check_wrong_image_phase1(shown_ids: number[]): boolean {
    for (let id of [7, 8, 9, 10, 11]) {
        if (huskylens.isAppear_s(id) && !(shown_ids.indexOf(id) >= 0)) {
            shown_ids.push(id)
            return true
        }
        
    }
    return false
}

function check_wrong_image_phase2(shown_ids: number[]): boolean {
    for (let id of [1, 2, 3, 4, 5, 6]) {
        if (huskylens.isAppear_s(id) && !(shown_ids.indexOf(id) >= 0)) {
            shown_ids.push(id)
            return true
        }
        
    }
    return false
}

function check_wrong_image_phase3(shown_ids: number[]): boolean {
    for (let id of [12, 13]) {
        if (huskylens.isAppear_s(id) && !(shown_ids.indexOf(id) >= 0)) {
            shown_ids.push(id)
            return true
        }
        
    }
    return false
}

function check_wrong_image_phase4(shown_ids: number[]): boolean {
    for (let id of [14, 15, 16]) {
        if (huskylens.isAppear_s(id) && !(shown_ids.indexOf(id) >= 0)) {
            shown_ids.push(id)
            return true
        }
        
    }
    return false
}

//  =========第一回合 =========
function display_countdown_phase1(seconds: number) {
    let shown_wrong_ids : number[] = []
    let tick = 0
    for (let i = seconds; i > 0; i += -1) {
        basic.showNumber(i)
        tick += 1
        if (tick % 3 == 0) {
            huskylens.request()
            if (check_image_phase1()) {
                basic.showIcon(IconNames.Yes)
                
                score += 1
                break
            } else if (check_wrong_image_phase1(shown_wrong_ids)) {
                music.playTone(196, music.beat(BeatFraction.Eighth))
                basic.showString("X")
            }
            
        }
        
        basic.pause(1000)
    }
}

//  ========= 第二回合 =========
function display_countdown_phase2(seconds: number) {
    let shown_wrong_ids : number[] = []
    let tick = 0
    for (let i = seconds; i > 0; i += -1) {
        basic.showNumber(i)
        tick += 1
        if (tick % 3 == 0) {
            huskylens.request()
            if (check_image_phase2()) {
                basic.showIcon(IconNames.Yes)
                
                score2 += 1
                break
            } else if (check_wrong_image_phase2(shown_wrong_ids)) {
                music.playTone(196, music.beat(BeatFraction.Eighth))
                basic.showString("X")
            }
            
        }
        
        basic.pause(1000)
    }
}

//  ========= 進階挑戰 =========
function display_advance_challenge(total_seconds: number) {
    let shown_wrong_ids : number[] = []
    let tick = 0
    let question = 1
    let correct_count = 0
    for (let i = total_seconds; i > 0; i += -1) {
        basic.showNumber(i)
        tick += 1
        if (tick % 3 == 0) {
            huskylens.request()
            if (check_image_phase3()) {
                basic.showIcon(IconNames.Yes)
                
                advance_score += 5
                correct_count += 1
                question += 1
                if (correct_count >= 5) {
                    break
                }
                
            } else if (question <= 3) {
                if (check_wrong_image_phase3(shown_wrong_ids)) {
                    music.playTone(196, music.beat(BeatFraction.Eighth))
                    basic.showString("X")
                }
                
            } else if (check_wrong_image_phase4(shown_wrong_ids)) {
                music.playTone(196, music.beat(BeatFraction.Eighth))
                basic.showString("X")
            }
            
        }
        
        basic.pause(1000)
    }
}

//  ========= 第一階段 (A鍵) =========
function start_quiz() {
    
    is_advanced = false
    score = 0
    display_countdown_phase1(countdown_limit)
    basic.clearScreen()
    basic.showString("Score:")
    basic.showNumber(score)
}

//  ========= 第二階段 (B鍵) =========
function start_quiz2() {
    
    is_advanced = false
    score2 = 0
    display_countdown_phase2(countdown_limit)
    basic.clearScreen()
    basic.showString("Score2:")
    basic.showNumber(score + score2)
}

//  ========= 進階挑戰階段 (A+B鍵) =========
function start_advanced() {
    
    is_advanced = true
    advance_score = 0
    display_advance_challenge(advance_time)
    basic.clearScreen()
    basic.showString("AdvScore:")
    basic.showNumber(advance_score)
    basic.showString("Total:")
    basic.showNumber(score + score2 + advance_score)
}

//  ========= 按鍵事件 =========
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (is_running) {
        return
    }
    
    is_running = true
    basic.clearScreen()
    let start_text = "START!"
    let start_tones = [262, 294, 330, 349, 392, 440]
    for (let i = 0; i < start_text.length; i++) {
        basic.showString(start_text[i])
        music.playTone(start_tones[i], music.beat(BeatFraction.Eighth))
        basic.pause(100)
    }
    basic.pause(500)
    start_quiz()
    is_running = false
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (is_running) {
        return
    }
    
    is_running = true
    basic.clearScreen()
    let start_text = "START!"
    let start_tones = [262, 294, 330, 349, 392, 440]
    for (let i = 0; i < start_text.length; i++) {
        basic.showString(start_text[i])
        music.playTone(start_tones[i], music.beat(BeatFraction.Eighth))
        basic.pause(100)
    }
    basic.pause(500)
    start_quiz2()
    is_running = false
})
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    
    if (is_running) {
        return
    }
    
    is_running = true
    basic.clearScreen()
    let adv_text = "START!"
    let adv_tones = [220, 196, 175, 165]
    for (let i = 0; i < adv_text.length; i++) {
        basic.showString(adv_text[i])
        music.playTone(adv_tones[i], music.beat(BeatFraction.Eighth))
        basic.pause(100)
    }
    basic.pause(500)
    start_advanced()
    is_running = false
})
