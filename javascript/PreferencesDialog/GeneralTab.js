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
