'use strict';

function PartyManagerViewModel() {
    var self = this;

    self.loggedIn = ko.observable(false);
    self.inAParty = ko.observable(false);
    self.parties = ko.observableArray([]);

    self.createOrJoin = ko.observable('create');

    self.roomName = ko.observable('Best Room Ever');
    self.roomId = ko.observable('asdsdasdadsa');

    self.load = function() {
        Notifications.authentication.loggedIn.add(self.dataHasChanged);
        self.parties(self._getParties());
    };

    self.unload = function() {
        Notifications.authentication.loggedIn.remove(self.dataHasChanged);
    };

    /* UI Methods */

    self.roomLink = ko.pureComputed(function() {
        if (self.roomId() && self.roomName()) {
            return encodeURI(Settings.HOST_URL + '?node_jid=' + self.roomId()
                + '&room_name=' + self.roomName());
        }
        return '';
    });

    self.createPartyWasClicked = function() {
        self.createParty();
    };

    self.joinPartyWasClicked = function() {
        self.joinParty(self.roomId());
    };

    self.joinPartyWasClickedWithParty = function(party) {
        self.joinParty(party.partyId());
    };

    self.leavePartyWasClicked = function() {
        self.leaveParty(self.roomId());
    };

    /* Public Methods */

    self.createParty = function() {

    };

    self.joinParty = function(partyId) {

    };

    self.leaveParty = function(partyId) {

    };

    self.dataHasChanged = function() {
        var token = PersistenceService.findAll(AuthenticationToken)[0]
        self.loggedIn(token && token.isValid());
    };

    /* Private Methods */

    self._getParties = function() {
        return PersistenceService.findAll(Party);
    };


}
