describe 'Support codeblock input', ->
    textarea = null
    action = null
    text = null
    currentPos = null
    markdownEditor = null
    shiftKey = false
    keyCode = 13

    beforeEach ->
      textarea = $('<textarea>').markdownEditor()
      markdownEditor = textarea.data('markdownEditor')

      action = ->
        enterEvent = $.Event('keydown', keyCode: keyCode, shiftKey: shiftKey)

        textarea.val(text)
        pos = if currentPos? then currentPos else text.length

        markdownEditor.getSelectionStart = ->
          pos
        markdownEditor.selectionBegin = markdownEditor.selectionEnd = pos

        textarea.trigger(enterEvent)

    afterEach ->
      textarea = null
      action = null
      text = null
      currentPos = null
      markdownEditor = null
      shiftKey = false
      keyCode = 13

    context 'inner codeblock', ->
      context '`', ->
        beforeEach -> text = "```\n"

        context 'input end codeblock format', ->
          beforeEach ->
            text += "```"
            action()

          it 'do nothing', ->
            expect(textarea.val()).to.eql "```\n```"

        context 'input begin codeblock format', ->
          beforeEach ->
            text += "\n```abc\n\n```"

          context 'at first line', ->
            beforeEach ->
              currentPos = 3
              action()

            it 'do nothing', ->
              expect(textarea.val()).to.eql "```\n\n```abc\n\n```"

          context 'at second line', ->
            beforeEach -> action()

            it 'do nothing', ->
              expect(textarea.val()).to.eql "```\n\n```abc\n\n```"

        context 'input text', ->
          beforeEach ->
            text += "aaa"
            action()

          it 'do nothing', ->
            expect(textarea.val()).to.eql "```\naaa"

      context '~', ->
        beforeEach -> text = "~~~\n"

        context 'input end codeblock format', ->
          beforeEach ->
            text += "~~~"
            action()

          it 'do nothing', ->
            expect(textarea.val()).to.eql "~~~\n~~~"

        context 'input begin codeblock format', ->
          beforeEach ->
            text += "~~~abc"
            action()

          it 'do nothing', ->
            expect(textarea.val()).to.eql "~~~\n~~~abc"

        context 'input text', ->
          beforeEach ->
            text += "aaa"
            action()

          it 'do nothing', ->
            expect(textarea.val()).to.eql "~~~\naaa"

    context 'without codeblock', ->
      context '```', ->
        beforeEach ->
          text = "```"

        context 'input begin codeblock format', ->
          beforeEach -> action()

          it 'insert end codeblock', ->
            expect(textarea.val()).to.eql "```\n\n```"

        context 'input begin codeblock format with language', ->
          beforeEach ->
            text += "abc"

          context 'caret pos is end of line', ->
            beforeEach -> action()

            it 'insert end codeblock', ->
              expect(textarea.val()).to.eql "```abc\n\n```"

          context 'caret pos is beginning of line', ->
            beforeEach ->
              currentPos = 0
              action()

            it 'do nothing', ->
              expect(textarea.val()).to.eql "```abc"

        context 'input begin codeblock format with language and spaces', ->
          beforeEach ->
            text += "abc   "
            action()

          it 'insert end codeblock', ->
            expect(textarea.val()).to.eql "```abc   \n\n```"

        context 'input text', ->
          beforeEach ->
            text += "aaa b"
            action()

          it 'do nothing', ->
            expect(textarea.val()).to.eql "```aaa b"

      context '~~~', ->
        beforeEach ->
          text = "~~~"

        context 'input begin codeblock format', ->
          beforeEach -> action()

          it 'insert end codeblock', ->
            expect(textarea.val()).to.eql "~~~\n\n~~~"

        context 'input begin codeblock format with language', ->
          beforeEach ->
            text += "abc"
            action()

          it 'insert end codeblock', ->
            expect(textarea.val()).to.eql "~~~abc\n\n~~~"

        context 'input begin codeblock format with language and spaces', ->
          beforeEach ->
            text += "abc   "
            action()

          it 'insert end codeblock', ->
            expect(textarea.val()).to.eql "~~~abc   \n\n~~~"

        context 'input text', ->
          beforeEach ->
            text += "aaa b"
            action()

          it 'do nothing', ->
            expect(textarea.val()).to.eql "~~~aaa b"
