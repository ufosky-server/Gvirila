function Preferences (languages) {

    function read (name) {
        try {
            return localStorage[name]
        } catch (e) {
        }
    }

    function readBoolean (name) {
        return read(name) == '1'
    }

    function readInt (name, min, max, defaultValue) {
        var value = parseInt(read(name), 10)
        if (isFinite(value)) {
            return Math.max(min, Math.min(max, value))
        }
        return defaultValue
    }

    function remove (name) {
        try {
            delete localStorage[name]
        } catch (e) {
        }
    }

    function setTabLength (_tabLength) {
        tabLength = _tabLength
        tab = ''
        for (var i = 0; i < tabLength; i++) {
            tab += ' '
        }
    }

    function write (name, value) {
        try {
            localStorage[name] = value
        } catch (e) {
        }
    }

    function writeBoolean (name, value) {
        if (value) write(name, '1')
        else remove(name)
    }

    var changeListeners = []

    var tab, tabLength

    var that = {
        autoIndentEnabled: !readBoolean('autoIndentDisabled'),
        lang: 'en',
        language: languages.en,
        showHiddenFiles: readBoolean('showHiddenFiles'),
        showLineNumbers: !readBoolean('hideLineNumbers'),
        showPreviewPane: readBoolean('showPreviewPane'),
        showSidePane: !readBoolean('hideSidePane'),
        showStatusBar: readBoolean('showStatusBar'),
        showToolBar: !readBoolean('hideToolBar'),
        setTabLength: setTabLength,
        spellCheckerEnabled: readBoolean('spellCheckerEnabled'),
        getTab: function () {
            return tab
        },
        onChange: function (listener) {
            changeListeners.push(listener)
        },
        save: function () {
            writeBoolean('autoIndentDisabled', !that.autoIndentEnabled)
            writeBoolean('hideLineNumbers', !that.showLineNumbers)
            writeBoolean('hideSidePane', !that.showSidePane)
            writeBoolean('hideToolBar', !that.showToolBar)
            writeBoolean('showHiddenFiles', that.showHiddenFiles)
            writeBoolean('showPreviewPane', that.showPreviewPane)
            writeBoolean('showStatusBar', that.showStatusBar)
            writeBoolean('spellCheckerEnabled', that.spellCheckerEnabled)
            write('tabLength', tabLength)
            write('lang', that.lang)
            that.language = languages[that.lang]
            ArrayCall(changeListeners)
        },
        unChange: function (listener) {
            changeListeners.splice(changeListeners.indexOf(listener), 1)
        },
    }

    setTabLength(
        readInt('tabLength', Preferences.MIN_TAB_LENGTH, Preferences.MAX_TAB_LENGTH, Preferences.DEFAULT_TAB_LENGTH)
    )

    var lang = read('lang')
    if (languages.hasOwnProperty(lang)) {
        that.lang = lang
        that.language = languages[lang]
    }

    return that

}

Preferences.DEFAULT_TAB_LENGTH = 4
Preferences.MAX_TAB_LENGTH = 8
Preferences.MIN_TAB_LENGTH = 1
