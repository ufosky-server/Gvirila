function TopLabelFileField (preferences) {

    var fileField = FileField(preferences)

    var topLabel = TopLabel(fileField.element)

    return {
        element: topLabel.element,
        clear: fileField.clear,
        focus: fileField.focus,
        getFileInput: fileField.getFileInput,
        reloadPreferences: fileField.reloadPreferences,
        setLabelText: topLabel.setText,
    }

}
