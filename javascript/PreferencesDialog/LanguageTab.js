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
