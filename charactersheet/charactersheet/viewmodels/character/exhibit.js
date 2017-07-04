'use strict';

function ExhibitViewModel() {
    var self = this;

    self.name = ko.observable('');
    self.url = ko.observable('');

    self.load = function() {
        Notifications.xmpp.routes.pcard.add(self.exhibitGivenImage);
    };

    self.unload = function() {
        Notifications.xmpp.routes.pcard.remove(self.exhibitGivenImage);
    };

    self.exhibitGivenImage = function(pCard) {
        if (pCard.get('exhibitImage')[0]) {
            self.name(image.name);
            self.url(Utility.string.createDirectDropboxLink(image.url));
        } else {
            self.name('');
            self.url('');
        }
    };
}
