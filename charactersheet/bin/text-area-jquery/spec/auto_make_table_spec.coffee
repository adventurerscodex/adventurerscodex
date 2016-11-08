describe 'Auto make table', ->
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

    context '"axc"', ->
      beforeEach ->
        action('axc')

      it 'nothing do', ->
        expect(textarea.val()).to.eql 'axc'

    context '"3x2"', ->
      context 'select range', ->
        beforeEach ->
          action('3x2', 1, 2)

        it 'nothing do', ->
          expect(textarea.val()).to.eql '3x2'

      context 'unselect range', ->
        beforeEach ->
          action('3x2')

        it 'make table', ->
          expect(textarea.val()).to.eql "|  |  |  |\n| --- | --- | --- |\n|  |  |  |"

    context '":3x2"', ->
      beforeEach ->
        action(':3x2')

      it 'make table and align left', ->
        expect(textarea.val()).to.eql "|  |  |  |\n| :--- | :--- | :--- |\n|  |  |  |"

    context '"3x2:"', ->
      beforeEach ->
        action('3x2:')

      it 'make table and align right', ->
        expect(textarea.val()).to.eql "|  |  |  |\n| ---: | ---: | ---: |\n|  |  |  |"

    context '":3x2:"', ->
      beforeEach ->
        action(':3x2:')

      it 'make table and align center', ->
        expect(textarea.val()).to.eql "|  |  |  |\n| :---: | :---: | :---: |\n|  |  |  |"
