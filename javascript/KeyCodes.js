var KeyCodes = {
    ALT: 18,
    BACKSPACE: 8,
    CAPS_LOCK: 20,
    CTRL: 17,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESC: 27,
    HOME: 36,
    LEFT: 37,
    NUM_LOCK: 144,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    RIGHT: 39,
    SCROLL_LOCK: 145,
    SHIFT: 16,
    TAB: 9,
    UP: 38,
    F2: 113,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    A: 'A'.charCodeAt(0),
    B: 'B'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    E: 'E'.charCodeAt(0),
    F: 'F'.charCodeAt(0),
    G: 'G'.charCodeAt(0),
    H: 'H'.charCodeAt(0),
    I: 'I'.charCodeAt(0),
    L: 'L'.charCodeAt(0),
    M: 'M'.charCodeAt(0),
    N: 'N'.charCodeAt(0),
    O: 'O'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    W: 'W'.charCodeAt(0),
    Z: 'Z'.charCodeAt(0),
    LEFT_SQUARE_BRACKET: 219,
    RIGHT_SQUARE_BRACKET: 221,
    isChar: function (keyCode) {
        return !KeyCodes.isArrow(keyCode) && keyCode != KeyCodes.ALT && 
            keyCode != KeyCodes.CTRL && keyCode != KeyCodes.SHIFT &&
            keyCode != KeyCodes.HOME && keyCode != KeyCodes.END &&
            keyCode != KeyCodes.PAGE_UP && keyCode != KeyCodes.PAGE_DOWN &&
            keyCode != KeyCodes.NUM_LOCK && keyCode != KeyCodes.CAPS_LOCK &&
            keyCode != KeyCodes.SCROLL_LOCK && keyCode != KeyCodes.ESC
    },
    isArrow: function (keyCode) {
        return keyCode >= 37 && keyCode <= 40
    },
}
