function AboutDialog_Dialog (dialogContainer, preferences, remoteApi) {

    function showDialog (subdialog) {

        function hideListener () {
            closeButton.enable()
            licenseButton.enable()
            subdialog.unHide(hideListener)
            dialog.enableShortcuts()
        }

        dialog.disableShortcuts()
        closeButton.disable()
        licenseButton.disable()
        subdialog.onHide(hideListener)
        subdialog.show()

    }

    var localVersionLabel = AboutDialog_VersionLabel(remoteApi.localVersion)

    var latestVersionLabel = AboutDialog_VersionLabel(remoteApi.latestVersion)

    var authorsLabel = AboutDialog_Label()
    authorsLabel.contentElement.innerHTML = '<a href="mailto:archil@imnadze.ge">Archil Imnadze</a>'

    var translatorsLabel = AboutDialog_Label()
    translatorsLabel.contentElement.innerHTML = '<a href="mailto:oniashvili60@gmail.com">Levan Qalabegishvili</a>'

    var classPrefix = 'AboutDialog_Dialog'

    var titleElement = Div(classPrefix + '-title')
    titleElement.appendChild(TextNode('Gvirila'))

    var websiteLink = document.createElement('a')
    websiteLink.href = 'http://gvirila.com/'
    websiteLink.target = 'blank'
    websiteLink.appendChild(TextNode('gvirila.com'))

    var websiteDiv = Div(classPrefix + '-website')
    websiteDiv.appendChild(websiteLink)

    var contentElement = AbsoluteDiv(classPrefix + '-content')
    contentElement.style.backgroundImage = 'url(images/logo.png)'
    contentElement.appendChild(titleElement)
    contentElement.appendChild(authorsLabel.element)
    contentElement.appendChild(translatorsLabel.element)
    contentElement.appendChild(localVersionLabel.element)
    contentElement.appendChild(latestVersionLabel.element)
    contentElement.appendChild(websiteDiv)

    var licenseDialog = LicenseDialog(dialogContainer, preferences)

    var licenseButton = Button()
    licenseButton.onClick(function () {
        showDialog(licenseDialog)
    })

    var closeButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(licenseButton)
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(contentElement)

    var dialog = Dialog(dialogContainer, classPrefix)
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {

            var terms = preferences.language.terms

            authorsLabel.setLabelText(terms.AUTHORS)
            translatorsLabel.setLabelText(terms.TRANSLATORS)
            localVersionLabel.setLabelText(terms.LOCAL_VERSION)
            latestVersionLabel.setLabelText(terms.LATEST_VERSION)

            licenseButton.setText(terms.LICENSE)
            closeButton.setText(terms.CLOSE)

            licenseDialog.reloadPreferences()

        },
        show: function () {
            dialog.show()
            closeButton.focus()
            localVersionLabel.load()
            latestVersionLabel.load()
        },
    }

}
