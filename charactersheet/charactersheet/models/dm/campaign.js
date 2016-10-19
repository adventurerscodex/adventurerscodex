'use strict';

/**
 * A Root Level DM Object containing overview information about a campaign.
 */
function Campaign() {
    var self = this;
    self.ps = PersistenceService.register(Campaign, self);

    self.characterId = ko.observable();
    self.playerName = ko.observable();
    self.name = ko.observable();
    self.notes = ko.observable();
    self.createdDate = ko.observable();
}

