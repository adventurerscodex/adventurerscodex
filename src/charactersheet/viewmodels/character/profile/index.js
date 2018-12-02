import { Core } from 'charactersheet/models/common/core';
import { CoreManager } from 'charactersheet/utilities';
import { Fixtures } from 'charactersheet/utilities';
import { Profile } from 'charactersheet/models/character';
import ko from 'knockout';
import template from './index.html';

export function ProfileViewModel() {
    var self = this;

    self.profile = ko.observable();
    self.core = ko.observable();
    self.loaded = ko.observable();

    self.data = {};

    self.coreHasChanged = ko.observable(false);
    self.profileHasChanged = ko.observable(false);

    // Static Data
    self.alignmentOptions = Fixtures.profile.alignmentOptions;
    self.classOptions = Fixtures.profile.classOptions;
    self.raceOptions = Fixtures.profile.raceOptions;

    // Pre-populate methods
    self.setAlignment = function(label, value) {
        self.profile().alignment(value);
    };

    self.setClass = function(label, value) {
        self.profile().characterClass(value);
    };

    self.setRace = function(label, value) {
        self.profile().race(value);
    };

    self.validation = {
        rules : {
            // Deep copy of properties in object
            ...Profile.validationConstraints.rules,
            ...Core.validationConstraints.rules
        }
    };

    self.load = async function() {
        self.loaded(false);
        await this.reset();
        self.loaded(true);
    };

    self.reset = async () => {
        var key = CoreManager.activeCore().uuid();
        const profileResponse = await Profile.ps.read({uuid: key});
        self.profile(profileResponse.object);
        self.core(CoreManager.activeCore());

        self.data = {
            profile: self.profile,
            core: self.core
        };

        self.resetSubscriptions();
    };

    self.resetSubscriptions = () => {
        self.core().playerName.subscribe(self.saveCore);
        self.profile().alignment.subscribe(self.saveProfile);
        self.profile().deity.subscribe(self.saveProfile);
        self.profile().gender.subscribe(self.saveProfile);
        self.profile().age.subscribe(self.saveProfile);
        self.profile().experience.subscribe(self.saveProfile);
        self.profile().weight.subscribe(self.saveProfile);
        self.profile().height.subscribe(self.saveProfile);
        self.profile().hairColor.subscribe(self.saveProfile);
        self.profile().eyeColor.subscribe(self.saveProfile);
        self.profile().skinColor.subscribe(self.saveProfile);
        self.profile().characterClass.subscribe(self.saveProfile);
        self.profile().race.subscribe(self.saveProfile);

        self.profileHasChanged(false);
        self.coreHasChanged(false);
    };

    self.saveProfile = () => {
        self.profileHasChanged(true);
    };

    self.saveCore = () => {
        self.coreHasChanged(true);
    };

    self.save = async () => {
        if (self.coreHasChanged()) {
            const coreResponse = await self.core().ps.save();
            self.core(coreResponse.object);
        }

        if (self.profileHasChanged()) {
            const profileResponse = await self.profile().ps.save();
            self.profile(profileResponse.object);
        }

        self.resetSubscriptions();
    };

    self.isNumeric = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    // UI Labels
    self.alignmentLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().alignment() && self.profile().alignment().trim()) {
                return self.profile().alignment();
            } else {
                return 'No Alignment';
            }
        }
    });

    self.deityLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().deity() && self.profile().deity().trim()) {
                return self.profile().deity();
            } else {
                return 'No Deity';
            }
        }
    });

    self.raceLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().race() && self.profile().race().trim()) {
                return self.profile().race();
            } else {
                return 'No Race';
            }
        }
    });

    self.characterClassLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().characterClass() && self.profile().characterClass().trim()) {
                return self.profile().characterClass();
            } else {
                return 'No Class';
            }
        }
    });

    self.genderLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().gender() && self.profile().gender().trim()) {
                return self.profile().gender();
            } else {
                return 'No Gender';
            }
        }
    });

    self.ageLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.isNumeric(self.profile().age())) {
                return self.profile().age();
            } else {
                return 'No Age';
            }
        }
    });

    self.weightLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.isNumeric(self.profile().weight())) {
                return self.profile().weight();
            } else {
                return 'No Weight';
            }
        }
    });

    self.hairColorLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().hairColor() && self.profile().hairColor().trim()) {
                return self.profile().hairColor();
            } else {
                return 'No Hair Color';
            }
        }
    });

    self.eyeColorLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().eyeColor() && self.profile().eyeColor().trim()) {
                return self.profile().eyeColor();
            } else {
                return 'No Eye Color';
            }
        }
    });

    self.skinColorLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().skinColor() && self.profile().skinColor().trim()) {
                return self.profile().skinColor();
            } else {
                return 'No Skin Color';
            }
        }
    });

    self.heightLabel = ko.computed(() => {
        if (self.profile()) {
            if (self.profile().height() && self.profile().height().trim()) {
                return self.profile().height();
            } else {
                return 'No Height';
            }
        }
    });
}

ko.components.register('profile', {
    viewModel: ProfileViewModel,
    template: template
});
