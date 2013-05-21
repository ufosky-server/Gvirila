(function () {

    function byId (id) {
        return document.getElementById(id)
    }

    function createExecutor (id, methodName) {
        byId(id).addEventListener('click', richTextarea[methodName])
    }

    function createLogger (id, methodName) {
        byId(id).addEventListener('click', function () {
            console.log(richTextarea[methodName]())
        })
    }

    function createOneArgExecutor (id, methodName) {
        byId(id).addEventListener('click', function () {
            richTextarea[methodName](byId('oneArgInput').value)
        })
    }

    function createTwoArgExecutor (id, methodName) {
        byId(id).addEventListener('click', function () {
            richTextarea[methodName](
                byId('twoArgInput1').value,
                byId('twoArgInput2').value
            )
        })
    }

    var languages = Languages()

    var preferences = Preferences(languages)

    var richTextarea = RichTextarea_Textarea(preferences)
    richTextarea.element.style.height = '200px'
    richTextarea.element.style.width = '200px'
    richTextarea.onCanUndoRedo(function () {
        console.log('CanUndoRedo', arguments)
    })
    richTextarea.onCursorLineChange(function () {
        console.log('CursorLineChange', arguments)
    })
    richTextarea.onInput(function () {
        console.log('Input', arguments)
    })
    richTextarea.onScroll(function () {
        console.log('Scroll', arguments)
    })
    richTextarea.onSelectionChange(function () {
        console.log('SelectionChange', arguments)
    })

    createExecutor('deleteTextButton', 'deleteText')
    createExecutor('disableButton', 'disable')
    createExecutor('enableButton', 'enable')
    createExecutor('focusButton', 'focus')
    createExecutor('redoButton', 'redo')
    createExecutor('selectButton', 'select')
    createExecutor('undoButton', 'undo')

    createLogger('canDeleteTextButton', 'canDeleteText')
    createLogger('canRedoButton', 'canRedo')
    createLogger('canUndoButton', 'canUndo')
    createLogger('getScrollBarHeightButton', 'getScrollBarHeight')
    createLogger('getScrollTopButton', 'getScrollTop')
    createLogger('getSelectionDirectionButton', 'getSelectionDirection')
    createLogger('getSelectionEndButton', 'getSelectionEnd')
    createLogger('getSelectionStartButton', 'getSelectionStart')
    createLogger('getSelectedTextButton', 'getSelectedText')
    createLogger('getValueButton', 'getValue')

    createOneArgExecutor('findNextButton', 'findNext')
    createOneArgExecutor('findPrevButton', 'findPrev')
    createOneArgExecutor('goToLineButton', 'goToLine')
    createOneArgExecutor('moveSelectionEndButton', 'moveSelectionEnd')
    createOneArgExecutor('moveSelectionStartButton', 'moveSelectionStart')
    createOneArgExecutor('pasteButton', 'paste')
    createOneArgExecutor('replaceSelectedTextButton', 'replaceSelectedText')
    createOneArgExecutor('setValueButton', 'setValue')

    createTwoArgExecutor('replaceAllButton', 'replaceAll')
    createTwoArgExecutor('setSelectionRangeButton', 'setSelectionRange')

    document.body.appendChild(richTextarea.element)

})()
