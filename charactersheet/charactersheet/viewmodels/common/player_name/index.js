import 'bin/knockout-binding-contenteditable';
import {
    Campaign,
    Profile
} from 'charactersheet/models';
import { CharacterManager,
    Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';

export function PlayerNameViewModel() {
    var self = this;

    self.profile = ko.observable();
    self.playerType = ko.observable();
    self.campaign = ko.observable();
    self.name = ko.observable('');

    self.load = function() {
        self.dataHasChanged();
        Notifications.characterManager.changed.add(self.dataHasChanged);
        self.name.subscribe(self.nameHasChanged);
    };

    self.placeholderText = ko.pureComputed(function() {
        if (self.playerType() == 'character') {
            return '<i>Character Name</i>';
        } else {
            return '<i>A Story of Wonder</i>';
        }
    });

    self.nameHasChanged = function() {
        if (self.playerType() == 'character') {
            self.profile().characterName(self.name());
            self.profile().save();
            Notifications.profile.characterName.changed.dispatch();
        } else {
            self.campaign().name(self.name());
            self.campaign().save();
            Notifications.campaign.changed.dispatch();
        }
    };

    self.dataHasChanged = function() {
        var character = CharacterManager.activeCharacter();
        self.playerType(character.playerType().key);
        if (self.playerType() == 'character') {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', character.key());
            if (profile) {
                self.profile(profile);
                self.name(profile.characterName());
            }
        } else {
            var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', character.key());
            if (campaign) {
                self.campaign(campaign);
                self.name(campaign.name());
            }
        }
    };
}

ko.components.register('player-name', {
    viewModel: PlayerNameViewModel,
    template: template
});