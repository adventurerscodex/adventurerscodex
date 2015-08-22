function ViewModel() {
	this.user = ko.observable(new User());
	this.stats = ko.observable(new Stats());
	this.note = ko.observable(new Note());
    this.abilityScores = ko.observable(new abilityScores());
};
