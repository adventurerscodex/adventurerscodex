describe 'Sort table', ->
    textarea = null
    action = null
    markdownEditor = null
    text = null
    setText = null

    beforeEach ->
      textarea = $('<textarea>').markdownEditor()
      markdownEditor = textarea.data('markdownEditor')

      setText = (text) ->
        textarea.val(text)

      action = (pos) ->
        enterEvent = $.Event('keydown', keyCode: 32, shiftKey: true)

        markdownEditor.getSelectionStart = -> pos
        markdownEditor.getSelectionEnd = -> pos
        markdownEditor.selectionBegin = pos
        markdownEditor.selectionEnd = pos

        textarea.trigger(enterEvent)

    afterEach ->
      textarea = null
      action = null
      markdownEditor = null
      text = null
      setText = null

    context 'single table', ->
      beforeEach ->
        setText "|a|b|\n|---|---|\n|h|9|\n|b|3|\n|f|1|"

      context 'first col', ->
        beforeEach ->
          action(1)

        it 'sort by first col', ->
          expect(textarea.val()).to.eql "|a|b|\n|---|---|\n|b|3|\n|f|1|\n|h|9|\n"

      context 'second col', ->
        context 'once', ->
          beforeEach ->
            action(3)

          it 'sort by second col asc', ->
            expect(textarea.val()).to.eql "|a|b|\n|---|---|\n|f|1|\n|b|3|\n|h|9|\n"

        context 'twice', ->
          beforeEach ->
            action(3)
            action(3)

          it 'sort by second col desc', ->
            expect(textarea.val()).to.eql "|a|b|\n|---|---|\n|h|9|\n|b|3|\n|f|1|\n"

    context 'double table', ->
        beforeEach ->
          setText "|a|b|\n|---|---|\n|h|9|\n|b|3|\n|f|1|\n\n|a|b|\n|---|---|\n|h|9|\n|b|3|\n|f|1|"

        context 'first col', ->
          beforeEach ->
            action(1)

          it 'sort by first col on first table', ->
            expect(textarea.val()).to.eql "|a|b|\n|---|---|\n|b|3|\n|f|1|\n|h|9|\n\n|a|b|\n|---|---|\n|h|9|\n|b|3|\n|f|1|"
