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
