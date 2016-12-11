'use strict';

function Monster() {
    var self = this;
    self.ps = PersistenceService.register(Monster, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'monsterId', 'name', 'size', 'type',
        'alignment', 'armorClass', 'hitPoints', 'speed', 'savingThrows',
        'skills', 'senses', 'damageVulnerabilities', 'damageImmunities', 'damageResistances',
        'conditionImmunities', 'languages', 'challenge', 'experience', 'description']
    };

    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.monsterId = ko.observable();
    self.name = ko.observable();
    self.size = ko.observable();
    self.type = ko.observable();
    self.alignment = ko.observable();
    self.armorClass = ko.observable();
    self.hitPoints = ko.observable();
    self.speed = ko.observable();
    self.abilityScores = ko.observableArray([new MonsterAbilityScore(), new MonsterAbilityScore(),
        new MonsterAbilityScore(), new MonsterAbilityScore(), new MonsterAbilityScore(),
        new MonsterAbilityScore()]);
    self.savingThrows = ko.observable();
    self.skills = ko.observable();
    self.senses = ko.observable();
    self.damageVulnerabilities = ko.observable();
    self.damageImmunities = ko.observable();
    self.damageResistances = ko.observable();
    self.conditionImmunities = ko.observable();
    self.languages = ko.observable();
    self.challenge = ko.observable();
    self.experience = ko.observable();
    self.description = ko.observable();

    // UI Stuff
    self.markDownDescription = ko.pureComputed(function() {
        return self.description() ? self.description() : '';
    });

    self.nameLabel = ko.pureComputed(function() {
        var label = self.size() ? self.size() : '';
        label += self.type() ? ' ' + self.type() : '';
        label += (self.size() && self.alignment()) || (self.type() && self.alignment()) ? ', ' : '';
        label += self.alignment() ? self.alignment() : '';
        return label;
    });

    //Public Methods
    self.findAbilityScoreByName = function(name) {
        var foundScore;
        self.abilityScores().forEach(function(score, idx, _) {
            if (score.name() == name) {
                foundScore = score;
            }
        });
        return foundScore;
    };

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
        self.abilityScores().forEach(function(score, idx, _) {
            score.save();
        });
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}
