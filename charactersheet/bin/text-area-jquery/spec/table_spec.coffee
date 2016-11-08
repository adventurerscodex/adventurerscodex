describe 'Support table input', ->
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
        pos = if currentPos?
          currentPos
        else
          text.length
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

    context 'start with "|a|b|"', ->
      beforeEach ->
        text = '|a|b|'
        action()

      it 'insert sep and row', ->
        expect(textarea.val()).to.eql "|a|b|\n| --- | --- |\n|  |  |"

      it 'select first cell', ->
        expect(markdownEditor.selectionBegin).to.eql 22
        expect(markdownEditor.selectionEnd).to.eql 22

    context 'start with "|a|b\\|c|"', ->
      beforeEach -> text = '|a|b\\|c|'

      it 'insert sep and row with 2 columns', ->
        action()
        expect(textarea.val()).to.eql "|a|b\\|c|\n| --- | --- |\n|  |  |"

    context 'in table header', ->
      beforeEach ->
        currentPos = 3
        text = "|a|b|\n|---|---|\n|aa|bb|"
        action()

      it 'not insert', ->
        expect(textarea.val()).to.eql "|a|b|\n|---|---|\n|aa|bb|"

    context 'in table', ->
      beforeEach ->
        text = "|a|b|\n|---|---|\n|aa|bb|"
        action()

      it 'insert row only', ->
        expect(textarea.val()).to.eql "|a|b|\n|---|---|\n|aa|bb|\n|  |  |"

      it 'select first cell of second row', ->
        expect(markdownEditor.selectionBegin).to.eql 26
        expect(markdownEditor.selectionEnd).to.eql 26

    context 'cursor on first cell', ->
      beforeEach ->
        currentPos = 1
        text = '|a|b|'
        action()

      it 'insert sep and row', ->
        expect(textarea.val()).to.eql "|a|b|\n| --- | --- |\n|  |  |"

      it 'select first cell of second row', ->
        expect(markdownEditor.selectionBegin).to.eql 22
        expect(markdownEditor.selectionEnd).to.eql 22

    context 'cursor on beginning of line on body', ->
      beforeEach ->
        currentPos = 16
        text = "|a|b|\n|---|---|\n|c|d|\n"
        action()

      it 'nothing do', ->
        expect(textarea.val()).to.eql "|a|b|\n|---|---|\n|c|d|\n"

    context 'new line on empty row', ->
      beforeEach ->
        currentPos = 18
        text = "|a|b|\n|---|---|\n| | |"

      it 'remove current line', ->
        action()
        expect(textarea.val()).to.eql "|a|b|\n|---|---|\n"

    context 'enter tab key', ->
      beforeEach -> keyCode = 9

      context 'normal table', ->
        beforeEach -> text = "|a|b|\n|---|---|\n| | |\n"

        context 'on line head', ->
          beforeEach -> currentPos = 0

          it 'cursor move to first cell', ->
            action()
            expect(markdownEditor.selectionBegin).to.eql 1
            expect(markdownEditor.selectionEnd).to.eql 2

          context 'with shift key', ->
            beforeEach -> shiftKey = true

            it 'do nothing', ->
              action()
              expect(markdownEditor.selectionBegin).to.eql 0
              expect(markdownEditor.selectionEnd).to.eql 0

        context 'on last cell', ->
          beforeEach -> currentPos = 20

          it 'cursor move to end of row', ->
            action()
            expect(markdownEditor.selectionBegin).to.eql 21
            expect(markdownEditor.selectionEnd).to.eql 21

        context 'on first cell', ->
          beforeEach -> currentPos = 1

          it 'cursor move to second cell', ->
            action()
            expect(markdownEditor.selectionBegin).to.eql 3
            expect(markdownEditor.selectionEnd).to.eql 4

          context 'with shift key', ->
            beforeEach -> shiftKey = true

            it 'do nothing', ->
              action()
              expect(markdownEditor.selectionBegin).to.eql 1
              expect(markdownEditor.selectionEnd).to.eql 1

        context 'on first cell of second line', ->
          beforeEach -> currentPos = 7

          context 'with shift key', ->
            beforeEach -> shiftKey = true

            it 'move to second cell of first line', ->
              action()
              expect(markdownEditor.selectionBegin).to.eql 3
              expect(markdownEditor.selectionEnd).to.eql 4

        context 'on second cell', ->
          beforeEach -> currentPos = 3

          it 'cursor move to first cell of next line', ->
            action()
            expect(markdownEditor.selectionBegin).to.eql 7
            expect(markdownEditor.selectionEnd).to.eql 10

          context 'with shift key', ->
            beforeEach -> shiftKey = true

            it 'cursor move to first cell', ->
              action()
              expect(markdownEditor.selectionBegin).to.eql 1
              expect(markdownEditor.selectionEnd).to.eql 2

      context 'oneline', ->
        beforeEach -> text = "| | | |"

        context 'on last', ->
            beforeEach -> currentPos = 7

          context 'with shift key', ->
            beforeEach -> shiftKey = true

            it 'cursor move to last cell', ->
              action()
              expect(markdownEditor.selectionBegin).to.eql 6
              expect(markdownEditor.selectionEnd).to.eql 6

      context 'empty cell', ->
        beforeEach -> text = "||||\n|---|---|\n| | |"

        context 'on second cell', ->
          beforeEach -> currentPos = 2

          it 'cursor move to third cell', ->
            action()
            expect(markdownEditor.selectionBegin).to.eql 3
            expect(markdownEditor.selectionEnd).to.eql 3

          context 'with shift key', ->
            beforeEach -> shiftKey = true

            it 'cursor move to first cell', ->
              action()
              expect(markdownEditor.selectionBegin).to.eql 1
              expect(markdownEditor.selectionEnd).to.eql 1

      context 'exists two table', ->
        beforeEach -> text = "|a|b|\n|---|---|\n|aa|bb|\n\n|c|d|"

        context 'on first cell of second table', ->
          beforeEach -> currentPos = 26

          context 'with shift key', ->
            beforeEach -> shiftKey = true

            it 'do nothing', ->
              action()
              expect(markdownEditor.selectionBegin).to.eql 26
              expect(markdownEditor.selectionEnd).to.eql 26

        context 'on last cell of first table', ->
          beforeEach -> currentPos = 21

          it 'move to end of row', ->
            action()
            expect(markdownEditor.selectionBegin).to.eql 23
            expect(markdownEditor.selectionEnd).to.eql 23

      context 'escaped pipe', ->
        beforeEach -> text = "| a\\|b | c |\n|---|---|---|\n||| | |"

        context 'on line head', ->
          beforeEach -> currentPos = 0

          it 'cursor move to first cell', ->
            action()
            expect(markdownEditor.selectionBegin).to.eql 2
            expect(markdownEditor.selectionEnd).to.eql 6

          context 'with shift key', ->
            beforeEach -> shiftKey = true

            it 'do nothing', ->
              action()
              expect(markdownEditor.selectionBegin).to.eql 0
              expect(markdownEditor.selectionEnd).to.eql 0
