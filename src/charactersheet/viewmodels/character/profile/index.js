import { CoreManager } from 'charactersheet/utilities';
import { Fixtures } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { Profile } from 'charactersheet/models/character';
import ko from 'knockout';
import template from './index.html';

export function ProfileViewModel() {
    var self = this;

    self.placeholderText = '<i>Character Name</i>';
    self.profile = ko.observable();
    self.background = ko.observable('');
    self.race = ko.observable('');
    self.alignment = ko.observable('');
    self.deity = ko.observable('');
    self.characterClass = ko.observable('');
    self.gender = ko.observable('');
    self.age = ko.observable('');

    //Static Data
    self.alignmentOptions = Fixtures.profile.alignmentOptions;
    self.classOptions = Fixtures.profile.classOptions;
    self.raceOptions = Fixtures.profile.raceOptions;

    //Prepopulate methods
    self.setAlignment = function(label, value) {
        self.alignment(value);
    };

    self.setClass = function(label, value) {
        self.characterClass(value);
    };

    self.setRace = function(label, value) {
        self.race(value);
    };

    self.load = async function() {
        var key = CoreManager.activeCore().uuid();
        const profileResponse = await Profile.ps.read({uuid: key});
        const profile = profileResponse.object;
        self.profile(profile);

        if (profile) {
            self.background(profile.background());
            self.race(profile.race());
            self.alignment(profile.alignment());
            self.deity(profile.deity());
            self.characterClass(profile.characterClass());
            self.gender(profile.gender());
            self.age(profile.age());
        }

        //Subscriptions
        self.background.subscribe(self.dataHasChanged);
        self.race.subscribe(self.dataHasChanged);
        self.alignment.subscribe(self.dataHasChanged);
        self.deity.subscribe(self.dataHasChanged);
        self.characterClass.subscribe(self.dataHasChanged);
        self.gender.subscribe(self.dataHasChanged);
        self.age.subscribe(self.dataHasChanged);
        self.profile().height.subscribe(self.dataHasChanged);
        self.profile().weight.subscribe(self.dataHasChanged);
        self.profile().hairColor.subscribe(self.dataHasChanged);
        self.profile().eyeColor.subscribe(self.dataHasChanged);
        self.profile().skinColor.subscribe(self.dataHasChanged);
        self.race.subscribe(self.raceDataHasChanged);
        self.characterClass.subscribe(self.typeClassDataHasChanged);
    };

    self.raceDataHasChanged = function() {
        self.saveProfile();
        Notifications.profile.race.changed.dispatch();
    };

    self.typeClassDataHasChanged = function() {
        self.saveProfile();
        Notifications.profile.playerClass.changed.dispatch();
    };

    self.dataHasChanged = function() {
        self.saveProfile();
        Notifications.profile.changed.dispatch();
    };

    //Public Methods

    self.saveProfile = async function() {
        self.profile().background(self.background());
        self.profile().race(self.race());
        self.profile().alignment(self.alignment());
        self.profile().deity(self.deity());
        self.profile().characterClass(self.characterClass());
        self.profile().gender(self.gender());
        self.profile().age(self.age());
        await self.profile().ps.save();
    };
}

ko.components.register('profile', {
    viewModel: ProfileViewModel,
    template: template
});