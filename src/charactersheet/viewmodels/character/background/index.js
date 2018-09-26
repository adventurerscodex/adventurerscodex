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
        var key = CoreManager.activeCore().uuid();
        const response = await Background.ps.read({uuid: key});
        self.background(response.object);
    };

    self.setBackground = function(label, value) {
        self.background().name(value);
    };

    self.save = async () => {
        await self.background().ps.save();
    };

    self.validation = {
        // Deep copy of properties in object
        ...Background.validationConstraints
    };
}

ko.components.register('background', {
    viewModel: BackgroundViewModel,
    template: template
});
