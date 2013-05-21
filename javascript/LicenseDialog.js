function LicenseDialog (dialogContainer, preferences) {

    var contentElement = AbsoluteDiv('LicenseDialog-content')
    contentElement.innerHTML =
        'Gvirila is free software: you can redistribute it and/or modify<br />' +
        'it under the terms of the GNU General Public License as published by<br />' +
        'the Free Software Foundation, either version 3 of the License, or<br />' +
        '(at your option) any later version.<br />' +
        '<br />' +
        'This program is distributed in the hope that it will be useful,<br />' +
        'but WITHOUT ANY WARRANTY; without even the implied warranty of<br />' +
        'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br />' +
        'GNU General Public License for more details.<br />' +
        '<br />' +
        'You should have received a copy of the GNU General Public License<br />' +
        'along with this program.  If not, see ' +
        '<a href="http://www.gnu.org/licenses/" target="_blank">' +
        'http://www.gnu.org/licenses/' +
        '</a>.'

    var closeButton = Button()

    var buttonBar = ButtonBar()
    buttonBar.addButton(closeButton)
    buttonBar.contentElement.appendChild(contentElement)

    var dialog = Dialog(dialogContainer, 'LicenseDialog')
    dialog.contentElement.appendChild(buttonBar.element)

    closeButton.onClick(dialog.hide)

    return {
        onHide: dialog.onHide,
        unHide: dialog.unHide,
        reloadPreferences: function () {
            var terms = preferences.language.terms
            closeButton.setText(terms.CLOSE)
        },
        show: function () {
            dialog.show()
            closeButton.focus()
        },
    }

}
