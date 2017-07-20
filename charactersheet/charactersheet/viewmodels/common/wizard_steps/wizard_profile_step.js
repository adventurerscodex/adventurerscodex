'use strict';

function WizardProfileStepViewModel() {
    var self = this;

    self.TEMPLATE_FILE = 'wizard_profile_step.tmpl';
    self.IDENTIFIER = 'WizardProfileStep';

    self.REQUIRED_FIELDS = ['characterName', 'playerName'];

    // View Model Methods

    self.init = function() { };

    self.load = function() { };

    self.unload = function() { };

    // View Properties

    self.characterName = ko.observable().extend({ required: '&#9679; Required' });
    self.playerName = ko.observable().extend({ required: '&#9679; Required' });
    self.race = ko.observable();
    self.background = ko.observable();
    self.backpack = ko.observable();
    self.typeClass = ko.observable();
    self.alignment = ko.observable();
    self.age = ko.observable();
    self.gender = ko.observable();
    self.diety = ko.observable();
    self.level = ko.observable();
    self.exp = ko.observable();

    //Static Data
    self.raceOptions = Fixtures.profile.raceOptions;
    self.classOptions = Fixtures.profile.classOptions;
    self.alignmentOptions = Fixtures.profile.alignmentOptions;
    self.backgroundOptions = Fixtures.profile.backgroundOptions;
    self.backpackOptions = Fixtures.wizardProfile.backpackOptions;

    //Prepopulate methods
    self.setRace = function(label, value) {
        self.race(value);
    };

    self.setClass = function(label, value) {
        self.typeClass(value);
    };

    self.setAlignment = function(label, value) {
        self.alignment(value);
    };

    self.setBackground = function(label, value) {
        self.background(value);
    };

    self.setBackpack = function(label, value) {
        self.backpack(value);
    };

    self.populateTraits = function() {
        var traits = [];
        var race = self.race();
        Object.keys(DataRepository.traits).forEach(function(key) {
            if (DataRepository.traits[key].race == race) {
                traits.push(DataRepository.traits[key]);
            }
        });

        return traits;
    };

    self.populateBackpackItems = function() {
        var items = [];
        var populatedItems = [];
        var backpack = self.backpack();
        Object.keys(DataRepository.backpacks).forEach(function(key) {
            //Obtain items array for matching backpack
            if (key == backpack) {
                items = DataRepository.backpacks[key];
            }
        });

        if (items) {
            items.forEach(function(element, idx, _) {
                var item = DataRepository.items[element.name];
                //Add item quantity from backpacks object
                item.itemQty = element.count;
                populatedItems.push(item);
            });
        }

        return populatedItems;
    };

    // Wizard Step Methods

    /**
     * Returns true if all required fields are filled.
     */
    self.ready = ko.pureComputed(function() {
        var emptyFields = self.REQUIRED_FIELDS.filter(function(field, idx, _) {
            return self[field]() ? !self[field]().trim() : true;
        });
        return emptyFields.length === 0;
    });

    /**
     * Returns an object containing the current values for
     * the fields in the form.
     */
    self.results = ko.pureComputed(function() {
        return {
            playerName: self.playerName(),
            characterName: self.characterName(),
            background: self.background(),
            race: self.race(),
            typeClass: self.typeClass(),
            age: self.age(),
            alignment: self.alignment(),
            gender: self.gender(),
            diety: self.diety(),
            level: self.level() || 1,
            exp: self.exp(),
            traits: self.populateTraits(),
            items: self.populateBackpackItems()
        };
    });
}
