import { Background } from 'charactersheet/models/character';
import { CoreManager } from 'charactersheet/utilities';
import { Fixtures } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';

export function BackgroundViewModel() {
    var self = this;

    self.background = ko.observable(new Background());
    self.backgroundOptions = Fixtures.profile.backgroundOptions;

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Background.ps.read({uuid: key});
        self.background(response.object);

        // Subscriptions
        self.background().personalityTrait.subscribe(self.dataHasChanged);
        self.background().ideal.subscribe(self.dataHasChanged);
        self.background().flaw.subscribe(self.dataHasChanged);
        self.background().bond.subscribe(self.dataHasChanged);
        self.background().name.subscribe(self.dataHasChanged);
    };

    self.setBackground = function(label, value) {
        self.background().name(value);
    };

    self.dataHasChanged = async () => {
        await self.background().ps.save();
    };

}

ko.components.register('background', {
    viewModel: BackgroundViewModel,
    template: template
});
