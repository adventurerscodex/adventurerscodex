import 'bin/knockout-custom-loader';
import {
    PlayerCard,
    pCard
} from 'charactersheet/models';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';

export function PartyViewModel() {
    var self = this;

    self.players = ko.observableArray();
    self.isConnectedToParty = ko.observable(false);

    self.load = function() {

    };

    self.unload = function() {

    };

}

ko.components.register('party', {
    viewModel: PartyViewModel,
    template: template
});
