describe 'font decoration', ->
  textarea = null
  action = null
  markdownEditor = null
  text = null
  setText = null

  beforeEach ->
    textarea = $('<textarea>').markdownEditor()
    markdownEditor = textarea.data('markdownEditor')

    action = ->
      markdownEditor.wrap('--')
      markdownEditor.getSelectionStart = -> pos
      markdownEditor.getSelectionEnd = -> pos
      markdownEditor.selectionBegin = pos
      markdownEditor.selectionEnd = pos

      textarea.trigger(enterEvent)

  describe '#wrap', ->
    beforeEach ->
      textarea.val('!LGTM!')
      markdownEditor.getSelectionStart = -> 1
      markdownEditor.getSelectionEnd = -> 5
      markdownEditor.selectionBegin = 1
      markdownEditor.selectionEnd = 5
      markdownEditor.wrap('--')

    it 'wrapped in "--"', ->
      expect(textarea.val()).to.eql '!--LGTM--!'
