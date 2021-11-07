import {
    CoreManager,
    Notifications,
    Utility } from 'charactersheet/utilities';
import { PlayerTypes } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './index.html';

export function ExhibitViewModel() {
    var self = this;

    self.name = ko.observable('');
    self.url = ko.observable('');
    self.isConnectedToParty = ko.observable(false);
    self.fullScreen = ko.observable(false);

    self.load = function() {

    };

    self.unload = function() {

    };

    self.checkForParty = function() {
         // TODO
    };

    self.toggleFullScreen = function() {
        self.fullScreen(!self.fullScreen());
    };

    self.exhibitGivenImage = function(pcards) {

    };
}

ko.components.register('exhibit', {
    viewModel: ExhibitViewModel,
    template: template
});
