function PreferencesDialog_Dialog (dialogContainer, preferences, languages) {

    var generalTab = PreferencesDialog_GeneralTab(preferences)

    var languageTab = PreferencesDialog_LanguageTab(preferences, languages)

    var tabs = Tabs_Tabs()
    tabs.addTab(generalTab)
    tabs.addTab(languageTab)
    tabs.selectTab(generalTab)

    var closeButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(tabs.element)

    var dialog = Dialog(dialogContainer, 'PreferencesDialog_Dialog')
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        element: dialog.element,
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            closeButton.setText(terms.CLOSE)
            generalTab.reloadPreferences()
            languageTab.reloadPreferences()
        },
        show: function () {
            dialog.show()
            generalTab.focus()
        },
    }

}
function PreferencesDialog_GeneralTab (preferences) {

    var tab = Tabs_Tab()

    var tabSizeSpinner = Spinner()
    tabSizeSpinner.setValue(preferences.getTab().length)
    tabSizeSpinner.setLimits(Preferences.MIN_TAB_LENGTH, Preferences.MAX_TAB_LENGTH)
    tabSizeSpinner.onChange(function () {
        preferences.setTabLength(tabSizeSpinner.getValue())
        preferences.save()
    })

    var autoIndentCheckBox = CheckBox()
    autoIndentCheckBox.setChecked(preferences.autoIndentEnabled)
    autoIndentCheckBox.onChange(function () {
        preferences.autoIndentEnabled = autoIndentCheckBox.isChecked()
        preferences.save()
    })

    var spellCheckerCheckBox = CheckBox()
    spellCheckerCheckBox.setChecked(preferences.spellCheckerEnabled)
    spellCheckerCheckBox.onChange(function () {
        preferences.spellCheckerEnabled = spellCheckerCheckBox.isChecked()
        preferences.save()
    })

    var tabSizeLabel = LeftLabel(tabSizeSpinner.element)

    var classPrefix = 'PreferencesDialog_GeneralTab'

    var tabSizeElement = Div(classPrefix + '-tabSize')
    tabSizeElement.appendChild(tabSizeLabel.element)

    var element = tab.contentElement
    element.classList.add(classPrefix)
    element.appendChild(tabSizeElement)
    element.appendChild(autoIndentCheckBox.element)
    element.appendChild(spellCheckerCheckBox.element)

    return {
        contentElement: element,
        deselect: tab.deselect,
        element: tab.element,
        focus: tabSizeSpinner.focus,
        onClick: tab.onClick,
        select: tab.select,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            tab.setText(terms.GENERAL)
            tabSizeLabel.setText(terms.TAB_SIZE)
            autoIndentCheckBox.setText(terms.ENABLE_AUTOMATIC_INDENTATION)
            spellCheckerCheckBox.setText(terms.ENABLE_SPELL_CHECKER)
        },
    }

}
function PreferencesDialog_LanguageTab (preferences, languages) {

    var tab = Tabs_Tab()

    var classPrefix = 'PreferencesDialog_LanguageTab'

    var listElement = Div(classPrefix + '-list')

    var element = tab.contentElement
    element.classList.add(classPrefix)
    element.appendChild(listElement)

    var activeCheckBox

    for (var i in languages) {
        (function (language, lang) {

            var terms = language.terms

            var active = preferences.lang == lang

            var checkBox = CheckBox()
            checkBox.setText(lang + ' - ' + terms._LANGUAGE_NAME)
            checkBox.onChange(function (e) {
                if (activeCheckBox == checkBox) {
                    e.cancel = true
                } else {
                    activeCheckBox.uncheck()
                    activeCheckBox = checkBox
                    preferences.lang = lang
                    preferences.save()
                }
            })
            if (active) {
                activeCheckBox = checkBox
                checkBox.check()
            }
            listElement.appendChild(checkBox.element)

        })(languages[i], i)
    }

    return {
        contentElement: element,
        deselect: tab.deselect,
        element: tab.element,
        onClick: tab.onClick,
        select: tab.select,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            tab.setText(terms.LANGUAGE)
        },
    }

}
