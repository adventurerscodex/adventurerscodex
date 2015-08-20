function Note() {
	this.text = ko.observable('', { persist: 'note.text' });

	this.clear = function() {
		this.text('');
	};
	
	this.importValues = function(values) {
		this.text(values.text);
	};
	
	this.exportValues = function() {
		return {
			text: this.text()
		}
	};
};

$(function(){
	ko.applyBindings(new Note());
});
