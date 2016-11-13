'use strict';

function PointOfInterestSectionViewModel(parentEncounter, pointOfInterestSection) {
    var self = this;

    self.template = 'poi_section.tmpl'
    self.encounterId = ko.observable(parentEncounter.encounterId());

    self.visible = ko.observable(pointOfInterestSection.visible());
    self.name = ko.observable(pointOfInterestSection.name());

    self.pointsOfInterest = ko.observableArray();
    self.selectedPointOfInterest = ko.observable();
    self.openModal = ko.observable(false);

    /* Public Methods */

    self.init = function() {};

    self.load = function() {
        var key = parentEncounter.encounterId();
        var poi = PersistenceService.findBy(PointOfInterest, 'encounterId', key);
        if (poi) {
            self.pointsOfInterest(poi);
        }
    };

    self.unload = function() {};

    self.save = function() {
        var state = PersistenceService.findBy(PointOfInterestViewState, 'encounterId', key);
        if (!state) {
            state = new PointOfInterestViewState();
            state.encounterId(encounterId());
        }

        state.name(self.name());
        state.visible(self.visible());
        state.save();

        self.pointsOfInterest().forEach(function(poi, idx, _) {
            poi.save();
        });
    };

    self.delete = function() {
        var state = PersistenceService.findBy(PointOfInterestViewState, 'encounterId', key);
        if (state) {
            state.delete();
        }

        self.pointsOfInterest().forEach(function(poi, idx, _) {
            poi.delete();
        });
    };

    /* UI Methods */

    self.addPointOfInterest = function() {

    };

    self.deletePointOfInterest = function() {

    };

    self.selectPointOfInterest = function() {

    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    /* Modal Methods */

    self.modalDidFinishOpening = function() {

    };

    self.modalDidFinishClosing = function() {

    };
}
