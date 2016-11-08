describe 'markdownEditor#isTableHeader', ->
    textarea = null
    action = null
    text = null
    markdownEditor = null

    beforeEach ->
      textarea = $('<textarea>').markdownEditor()
      markdownEditor = textarea.data('markdownEditor')

      action = (pos) ->
        textarea.val(text)

        markdownEditor.getSelectionStart = -> pos
        markdownEditor.selectionBegin = markdownEditor.selectionEnd = pos

        markdownEditor.isTableHeader()

    afterEach ->
      textarea = null
      action = null
      text = null
      markdownEditor = null

    beforeEach ->
      text = "a\n|a|b|\n|---|---|"

    context 'end of first line', ->
      it 'false', ->
        expect(action(1)).to.eql false

    context 'beginning of second line', ->
      it 'true', ->
        expect(action(2)).to.eql true

    context 'end of second line', ->
      it 'true', ->
        expect(action(7)).to.eql true

    context 'beginning of third line', ->
      it 'false', ->
        expect(action(8)).to.eql false
