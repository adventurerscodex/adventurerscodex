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
var ImageServiceManager = new SharedServiceManager(_ImageService, ImageServiceConfiguration);

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
        var environment = PersistenceService.findByPredicates(Environment, predicates)[0];
        if (environment) {
            environment.isExhibited(false);
            environment.save();
        }
        mapOrImages.forEach(function(element, idx, _) {
            element.isExhibited(false);
            element.save();
        });
        Notifications.encounters.changed.dispatch();
    };
}