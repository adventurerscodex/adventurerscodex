describe '#getCurrentLine', ->
    textarea = null
    action = null
    cursorPos = null
    markdownEditor = null
    firstLine = null
    secondLine = null

    beforeEach ->
      textarea = $('<textarea>').markdownEditor()
      markdownEditor = textarea.data('markdownEditor')
      downEvent = $.Event('keydown', keyCode: 40)
      enterEvent = $.Event('keydown', keyCode: 13)
      firstLine = 'abcdefg'
      secondLine = 'AAABBB'

      action = ->
        textarea.val("#{firstLine}\n#{secondLine}")
        textarea.data('markdownEditor').getSelectionStart = ->
          cursorPos

        markdownEditor.getCurrentLine()

    context 'first line is empty', ->
      beforeEach ->
        firstLine = ''

      context 'cursor on first line', ->
        beforeEach ->
          cursorPos = 0

        it 'get first line', ->
          expect(action()).to.eql firstLine

      context 'cursor on second line', ->
        beforeEach ->
          cursorPos = 1

        it 'get second line', ->
          expect(action()).to.eql secondLine

    context 'cursor on beginning of first line', ->
      beforeEach -> cursorPos = 0

      it 'get first line', ->
        expect(action()).to.eql firstLine

    context 'cursor on end of first line', ->
      beforeEach -> cursorPos = firstLine.length

      it 'get first line', ->
        expect(action()).to.eql firstLine

    context 'cursor on beginning of second line', ->
      beforeEach -> cursorPos = firstLine.length + 1

      it 'get second line', ->
        expect(action()).to.eql secondLine

    context 'cusor on end of second line', ->
      beforeEach -> cursorPos = firstLine.length + secondLine.length

      it 'get second line', ->
        expect(action()).to.eql secondLine

    context 'cursor on second char of second line', ->
      beforeEach -> cursorPos = firstLine.length + 2

      it 'get second line', ->
        expect(action()).to.eql secondLine
