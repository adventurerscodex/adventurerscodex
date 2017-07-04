'use strict';

function ExhibitViewModel() {
    var self = this;

    self.name = ko.observable('');
    self.url = ko.observable('');

    self.load = function() {
        Notifications.exhibit.display.add(self.exhibitGivenImage);
    };

    self.unload = function() {
        Notifications.exhibit.display.remove();
    };

    self.exhibitGivenImage = function(image) {
        if (image) {
            self.name(image.name);
            self.url(Utility.string.createDirectDropboxLink(image.url));
        } else {
            self.name('');
            self.url('');
        }
    };
}
