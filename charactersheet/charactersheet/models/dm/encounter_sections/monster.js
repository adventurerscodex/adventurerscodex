'use strict';

function Monster() {
    var self = this;
    self.ps = PersistenceService.register(Monster, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'name', 'size', 'type', 'alignment',
        'armorClass', 'hitPoints', 'speed', 'abilityScores', 'savingThrows',
        'skills', 'senses', 'damageVulnerabilities', 'damageImmunities', 'damageResistances',
        'conditionImmunities', 'languages', 'challenge', 'experience', 'description'];
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable();
    self.size = ko.observable();
    self.type = ko.observable();
    self.alignment = ko.observable();
    self.armorClass = ko.observable();
    self.hitPoints = ko.observable();
    self.speed = ko.observable();
    self.abilityScores = ko.observableArray();
    self.savingThrows = ko.observableArray();
    self.skills = ko.observableArray();
    self.senses = ko.observable();
    self.damageVulnerabilities = ko.observable();
    self.damageImmunities = ko.observable();
    self.damageResistances = ko.observable();
    self.conditionImmunities = ko.observable();
    self.languages = ko.observable();
    self.challenge = ko.observable();
    self.experience = ko.observable();
    self.description = ko.observable();

    //Public Methods

    self.clear = function() {
        var values = new Monster().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}
