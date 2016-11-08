describe 'Csv to table', ->
    textarea = null
    action = null
    markdownEditor = null
    keyCode = 32 # space

    beforeEach ->
      textarea = $('<textarea>').markdownEditor()
      markdownEditor = textarea.data('markdownEditor')

      action = (text, selectionStart = text.length, selectionEnd = text.length) ->
        enterEvent = $.Event('keydown', keyCode: keyCode, shiftKey: true)

        textarea.val(text)

        markdownEditor.getSelectionStart = -> selectionStart
        markdownEditor.getSelectionEnd = -> selectionEnd
        markdownEditor.selectionBegin = selectionStart
        markdownEditor.selectionEnd = selectionEnd

        textarea.trigger(enterEvent)

    afterEach ->
      textarea = null
      action = null
      markdownEditor = null
      keyCode = 32

    context 'csv', ->
      beforeEach ->
        action("a, b,c\ne,f, g", 0)

      it 'to table', ->
        expect(textarea.val()).to.eql "| a | b | c |\n| --- | --- | --- |\n| e | f | g |\n"
