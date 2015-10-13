function Note() {
	var self = this;

	self.text = ko.observable('');

	self.clear = function() {
		self.text('');
	};
	
	self.importValues = function(values) {
		self.text(values.text);
	};
	
	self.exportValues = function() {
		return {
			text: self.text()
		}
	};
};
