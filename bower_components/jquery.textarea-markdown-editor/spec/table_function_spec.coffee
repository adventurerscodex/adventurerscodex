describe 'Table Function', ->
  textarea = null
  action = null
  text = null
  currentPos = null
  markdownEditor = null

  beforeEach ->
    textarea = $('<textarea>').markdownEditor()
    markdownEditor = textarea.data('markdownEditor')
    shiftEnterEvent = $.Event('keydown', keyCode: 32, shiftKey: true)

    action = ->
      textarea.val(text)

      markdownEditor.getSelectionStart = -> currentPos
      markdownEditor.getSelectionEnd = -> currentPos
      markdownEditor.selectionBegin = markdownEditor.selectionEnd = currentPos

      textarea.trigger(shiftEnterEvent)

  afterEach ->
    textarea = null
    action = null
    text = null
    currentPos = null
    markdownEditor = null

  describe 'invalid function name', ->
    beforeEach ->
      text = "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n||=SU|"
      currentPos = text.length - 3

      action()

    it 'do nothing', ->
      expect(textarea.val()).to.eql text

  describe 'sum', ->
    context 'all type of number', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n||=SUM|"
        currentPos = text.length - 3

        action()

      it 'replace current cell', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n|| 60 |"

    context 'type of string', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n|c|10pt|\n|d|20pt|\n|e|30pt|\n||=SUM|"
        currentPos = text.length - 3

        action()

      it 'replace current cell', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|c|10pt|\n|d|20pt|\n|e|30pt|\n|| 60 |"

    context 'type of float', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n|c|1.1|\n|d|2.2|\n||=SUM|"
        currentPos = text.length - 3

        action()

      it 'replace current cell', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|c|1.1|\n|d|2.2|\n|| 3.3 |"

  describe 'average', ->
    context 'all type of number', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n||=Average|"
        currentPos = text.length - 3

        action()

      it 'replace current cell', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n|| 20 |"

    context 'type of string', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n|c|10pt|\n|d|20pt|\n|e|30pt|\n||=Average|"
        currentPos = text.length - 3

        action()

      it 'replace current cell', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|c|10pt|\n|d|20pt|\n|e|30pt|\n|| 20 |"

  describe 'max', ->
    context 'all type of number', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n||=max|"
        currentPos = text.length - 3

        action()

      it 'replace current cell', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n|| 30 |"

    context 'no data', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n||=max|"
        currentPos = text.length - 3

        action()

      it 'nothing do', ->
        expect(textarea.val()).to.eql text

  describe 'min', ->
    context 'all type of number', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n||=min|"
        currentPos = text.length - 3

        action()

      it 'replace current cell', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n|| 10 |"

    context 'no data', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n||=min|"
        currentPos = text.length - 3

        action()

      it 'nothing do', ->
        expect(textarea.val()).to.eql text

  describe 'count', ->
    context 'all type of number', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n||=Count|"
        currentPos = text.length - 3

        action()

      it 'replace current cell', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|c|10|\n|d|20|\n|e|30|\n|| 3 |"

    context 'no data', ->
      beforeEach ->
        text = "|z|x|\n|---|---|\n||=Count|"
        currentPos = text.length - 3

        action()

      it 'replace current cell to zero', ->
        expect(textarea.val()).to.eql "|z|x|\n|---|---|\n|| 0 |"
