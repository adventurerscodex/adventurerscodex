import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { EncounterImage } from 'charactersheet/models/common/image';
import { Environment } from 'charactersheet/models/dm/encounter_sections/environment';
import { Exhibit } from 'charactersheet/models/dm/exhibit';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SharedServiceManager } from '../shared_service_manager';

/**
 * The default configuration object for the Image service.
 */
var ImageServiceConfiguration = {
    defaultImageOptions: {
    }
};

/**
 * The shared instance manager for the Image Service.
 */
export var ImageServiceManager = new SharedServiceManager(_ImageService, ImageServiceConfiguration);

/**
 * An internal service implementation that manages Exhibit images and the states of the associated
 * models/view models.
 *
 * For an image to be Exhibited, it must be given to this service in the following form:
 * ```
 * {
 *  name: 'Image',
 *  url: 'my.url'
 * }
 * ```
 */
function _ImageService(config) {
    var self = this;

    self.config = config;

    self.init = function() {
    };

    self.publishImage = function(image) {
        self.purgeExistingExhibits();
        self.createExhibitModel(image);
        Notifications.exhibit.changed.dispatch();
    };

    self.clearImage = async () => {
        await self.purgeExistingExhibits();
        Notifications.exhibit.changed.dispatch();
    };

    self.createExhibitModel = function(image) {
        var exhibit = new Exhibit();
        exhibit.characterId(CoreManager.activeCore().uuid());
        exhibit.name(image.name);
        exhibit.url(image.url);
        exhibit.save();
    };

    self.purgeExistingExhibits = async () => {
        const exhibits = PersistenceService.findBy(
            Exhibit,
            'characterId',
            CoreManager.activeCore().uuid()
        );
        if (exhibits.length > 0) {
            exhibits.forEach(function(exhibit, idx, _) {
                exhibit.delete();
            });
        }
    };
}
