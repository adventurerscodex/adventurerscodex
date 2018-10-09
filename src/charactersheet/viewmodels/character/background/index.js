import { Background } from 'charactersheet/models/character';
import { CoreManager } from 'charactersheet/utilities';
import { Fixtures } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';

export function BackgroundViewModel() {
    var self = this;

    self.background = ko.observable(new Background());
    self.backgroundOptions = Fixtures.profile.backgroundOptions;
    self.validation = {};

    self.load = async () => {
        await self.reset();
    };

    self.reset = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Background.ps.read({uuid: key});
        self.background(response.object);
    };

    self.setBackground = function(label, value) {
        self.background().name(value);
    };

    self.save = async () => {
        const response = await self.background().ps.save();
        self.background(response.object);
    };

    self.validation = {
        // Deep copy of properties in object
        ...Background.validationConstraints
    };

    // UI Labels
    self.backgroundLabel = ko.computed(() => {
        if (self.background()) {
            if (self.background().name().trim()) {
                return self.background().name();
            } else {
                return 'No Background';
            }
        }
    });

    self.personalityTraitLabel = ko.computed(() => {
        if (self.background()) {
            if (self.background().personalityTrait().trim()) {
                return self.background().personalityTrait();
            } else {
                return 'No Personality Trait';
            }
        }
    });

    self.idealLabel = ko.computed(() => {
        if (self.background()) {
            if (self.background().ideal().trim()) {
                return self.background().ideal();
            } else {
                return 'No Ideal';
            }
        }
    });

    self.bondLabel = ko.computed(() => {
        if (self.background()) {
            if (self.background().bond().trim()) {
                return self.background().bond();
            } else {
                return 'No Bond';
            }
        }
    });

    self.flawLabel = ko.computed(() => {
        if (self.background()) {
            if (self.background().flaw().trim()) {
                return self.background().flaw();
            } else {
                return 'No Flaw';
            }
        }
    });
}

ko.components.register('background', {
    viewModel: BackgroundViewModel,
    template: template
});
