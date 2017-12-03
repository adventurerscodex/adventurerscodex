import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { CampaignMapOrImage } from 'charactersheet/models/common/campaign_map_or_image';
import { Environment } from 'charactersheet/models/dm/encounter_sections/environment';
import { Exhibit } from 'charactersheet/models/dm/exhibit';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { MapOrImage } from 'charactersheet/models/common/map_or_image';
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
        self.purgeExistingExibits();
        self.createExhibitModel(image);
        Notifications.exhibit.changed.dispatch();
    };

    self.clearImage = function() {
        self.purgeExistingExibits();
        Notifications.exhibit.changed.dispatch();
    };

    self.createExhibitModel = function(image) {
        var exhibit = new Exhibit();
        exhibit.characterId(CharacterManager.activeCharacter().key());
        exhibit.name(image.name);
        exhibit.url(image.url);
        exhibit.save();
    };

    self.purgeExistingExibits = function() {
        var exhibits = PersistenceService.findBy(Exhibit, 'characterId', CharacterManager.activeCharacter().key());
        if (exhibits.length > 0) {
            exhibits.forEach(function(exhibit, idx, _) {
                exhibit.delete();
            });
        }
    };

    self.clearExhibitFlag = function() {
        var predicates = [
            new KeyValuePredicate('characterId', CharacterManager.activeCharacter().key()),
            new KeyValuePredicate('isExhibited', true)
        ];
        var mapOrImages = PersistenceService.findByPredicates(MapOrImage, predicates);
        var campaignMapOrImages = PersistenceService.findByPredicates(CampaignMapOrImage, predicates);
        var environment = PersistenceService.findByPredicates(Environment, predicates)[0];
        if (environment) {
            environment.isExhibited(false);
            environment.save();
        }
        mapOrImages.forEach(function(element, idx, _) {
            element.isExhibited(false);
            element.save();
        });
        campaignMapOrImages.forEach(function(element, idx, _) {
            element.isExhibited(false);
            element.save();
        });
        Notifications.exhibit.toggle.dispatch();
    };
}
