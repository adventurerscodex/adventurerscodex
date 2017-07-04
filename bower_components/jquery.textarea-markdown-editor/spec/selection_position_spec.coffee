describe '#getPosBegninningOfLines', ->
  textarea = null
  action = null
  selectionStart = null
  selectionEnd = null
  markdownEditor = null

  beforeEach ->
    textarea = $('<textarea>').markdownEditor()
    markdownEditor = textarea.data('markdownEditor')

    textarea.val("abc\ndef\nfgh")

    action = ->
      markdownEditor.getSelectionStart = -> selectionStart
      markdownEditor.getSelectionEnd = -> selectionEnd

      markdownEditor.getPosBeginningOfLines(markdownEditor.getText())

  context 'no selection range', ->
    context 'middle position of line', ->
      beforeEach ->
        selectionStart = selectionEnd = 1

      it 'get one', ->
        expect(action()).to.eql [0]

    context 'beginning of second line', ->
      beforeEach ->
        selectionStart = selectionEnd = 4

      it 'get one', ->
        expect(action()).to.eql [4]

  context 'selection range', ->
    beforeEach ->
      selectionStart = 1
      selectionEnd = 8

    it 'get three', ->
      expect(action()).to.eql [0, 4, 8]
