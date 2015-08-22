function ViewModel() {
	this.user = ko.observable(new User());
	this.note = ko.observable(new Note());
    this.abilityScores = ko.observable(new abilityScores());
};
