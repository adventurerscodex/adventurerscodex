'use strict';

function ProfileViewModel() {
    var self = this;

    self.placeholderText = '<i>Character Name</i>';
    self.characterName =  ko.observable('');
    self.background = ko.observable('');
    self.playerName = ko.observable('');
    self.race = ko.observable('');
    self.alignment = ko.observable('');
    self.diety = ko.observable('');
    self.typeClass = ko.observable('');
    self.gender = ko.observable('');
    self.age = ko.observable('');
    self.level = ko.observable('');
    self.experience = ko.observable('');

    //Static Data
    self.alignmentOptions = Fixtures.profile.alignmentOptions;
    self.backgroundOptions = Fixtures.profile.backgroundOptions;
    self.classOptions = Fixtures.profile.classOptions;
    self.raceOptions = Fixtures.profile.raceOptions;

    //Prepopulate methods
    self.setAlignment = function(label, value) {
        self.alignment(value);
    };

    self.setBackground = function(label, value) {
        self.background(value);
    };

    self.setClass = function(label, value) {
        self.typeClass(value);
    };

    self.setRace = function(label, value) {
        self.race(value);
    };

    self.init = function() {
        Notifications.global.save.add(self.dataHasChanged);
    };

    self.load = function() {
        var profile = Profile.findBy(CharacterManager.activeCharacter().key())[0];
        if (profile) {
            self.level(profile.level());
            self.playerName(profile.playerName());
            self.characterName(profile.characterName());
            self.background(profile.background());
            self.race(profile.race());
            self.alignment(profile.alignment());
            self.diety(profile.diety());
            self.typeClass(profile.typeClass());
            self.gender(profile.gender());
            self.age(profile.age());
            self.experience(profile.exp());
        }

        //Subscriptions
        self.level.subscribe(self.dataHasChanged);
        self.playerName.subscribe(self.dataHasChanged);
        self.characterName.subscribe(self.dataHasChanged);
        self.background.subscribe(self.dataHasChanged);
        self.race.subscribe(self.dataHasChanged);
        self.alignment.subscribe(self.dataHasChanged);
        self.diety.subscribe(self.dataHasChanged);
        self.typeClass.subscribe(self.dataHasChanged);
        self.gender.subscribe(self.dataHasChanged);
        self.age.subscribe(self.dataHasChanged);
        self.experience.subscribe(self.dataHasChanged);

        Notifications.stats.changed.add(self.dataHasChanged);
    };

    self.unload = function() {
        Notifications.stats.changed.remove(self.dataHasChanged);
        Notifications.global.save.remove(self.dataHasChanged);
    };

    self.dataHasChanged = function() {
        var profile = Profile.findBy(CharacterManager.activeCharacter().key())[0];
        profile.level(self.level());
        profile.playerName(self.playerName());
        profile.characterName(self.characterName());
        profile.background(self.background());
        profile.race(self.race());
        profile.alignment(self.alignment());
        profile.diety(self.diety());
        profile.typeClass(self.typeClass());
        profile.gender(self.gender());
        profile.age(self.age());
        profile.exp(self.experience());
        profile.save();

        Notifications.profile.changed.dispatch();
    };

    //Public Methods

    self.clear = function() {
        self.characterName('');
        self.background('');
        self.playerName('');
        self.race('');
        self.alignment('');
        self.diety('');
        self.typeClass('');
        self.gender('');
        self.age('');
        self.level('');
        self.experience('');
    };
}
