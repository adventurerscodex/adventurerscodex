import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';


export function ImageModel() {
    var self = this;
    self.ps = PersistenceService.register(ImageModel, self);

    self.characterId = ko.observable(null);
    self.imageUrl = ko.observable();

    self.save = function() {
        self.ps.save();
    };

    self.clear = function() {
        self.imageUrl('');
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.imageUrl(values.imageUrl);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            imageUrl: self.imageUrl()
        };
    };

    /**
     * Returns whether or not the image is empty.
     */
    self.hasData = ko.pureComputed(function() {
        try {
            return (self.imageUrl().length > 10);
        } catch(err) {
            return false;
        }
    });
}
ImageModel.__name = "ImageModel";

PersistenceService.addToRegistry(ImageModel);
