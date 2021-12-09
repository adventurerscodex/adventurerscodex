import {
    SortService,
    PartyService,
} from 'charactersheet/services/common';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { EncounterImage } from 'charactersheet/models/common';
import ko from 'knockout';
import { get } from 'lodash';
import sectionIcon from 'images/encounters/globe.svg';
import template from './index.html';

export function MapsAndImagesSectionViewModel(params) {
    var self = this;

    self.sectionIcon = sectionIcon;
    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!self.encounter()) { return; }
        return self.encounter().uuid();
    });
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.mapsOrImages = ko.observableArray();
    self.blankMapOrImage = ko.observable(new EncounterImage());
    self.openModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.fullScreen = ko.observable(false);
    self.addFormIsValid = ko.observable(false);
    self.addModalOpen = ko.observable(false);

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' },
        'description asc': { field: 'description', direction: 'asc' },
        'description desc': { field: 'description', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    // Push to Player
    self.selectedMapOrImageToPush = ko.observable();
    self.openPushModal = ko.observable(false);
    self.pushType = ko.observable('image');
    self.convertedDisplayUrl = ko.observable();

    self._isConnectedToParty = ko.observable(!!PartyService.party);
    self._addForm = ko.observable();
    self._editForm = ko.observable();

    /* Public Methods */

    self.load = function() {
        Notifications.encounters.changed.add(self._dataHasChanged);
        Notifications.party.changed.add(self.partyDidChange);

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        self._dataHasChanged();
    };

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addMapOrImage();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...EncounterImage.validationConstraints
    };

    self.updateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...EncounterImage.validationConstraints
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.closeAddModal = () => {
        self.addModalOpen(false);

        // Let the validator reset the validation in the form.
        $(self._addForm()).validate().resetForm();
    };

    /* UI Methods */

    /**
     * Filters and sorts the weapons for presentation in a table.
     */
    self.filteredAndSortedMapsAndImages = ko.computed(function() {
        return SortService.sortAndFilter(self.mapsOrImages(), self.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    /**
     * Given a column name, determine the current sort type & order.
     */
    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
    };

    self.addMapOrImage = async function() {
        var mapOrImage = self.blankMapOrImage();
        mapOrImage.coreUuid(CoreManager.activeCore().uuid());
        mapOrImage.encounterUuid(self.encounterId());
        const imageResponse = await mapOrImage.ps.create();
        self.mapsOrImages.push(imageResponse.object);
        self.toggleAddModal();
        self.blankMapOrImage(new EncounterImage());
    };

    self.removeMapOrImage = async function(mapOrImage) {
        await mapOrImage.ps.delete();
        self.mapsOrImages.remove(mapOrImage);
    };

    self.editMapOrImage = function(mapOrImage) {
        self.editItemIndex = mapOrImage.uuid;
        self.currentEditItem(new EncounterImage());
        // clear out preview image before rendering the new item
        self.convertedDisplayUrl(null);
        self.currentEditItem().importValues(mapOrImage.exportValues());
        self.convertedDisplayUrl(Utility.string.createDirectDropboxLink(self.currentEditItem().sourceUrl()));
        self.openModal(true);
    };

    self.toggleMapOrImageExhibit = async (image) => {
        image.isExhibited(!image.isExhibited());
        await image.ps.save();
        self.markAsExhibited(image.isExhibited() ? image.uuid() : null);
    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.firstElementInModalHasFocus(true);
    };

    self.modalFinishedClosing = async function() {
        self.selectPreviewTab();

        if (self.openModal()) {
            const imageSaveResponse = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.mapsOrImages(), imageSaveResponse.object, self.editItemIndex);
        }

        self.openModal(false);
    };

    self.selectPreviewTab = function() {
        self.convertedDisplayUrl(Utility.string.createDirectDropboxLink(self.currentEditItem().sourceUrl()));
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.editTabStatus('active');
        self.previewTabStatus('');
        self.editFirstModalElementHasFocus(true);
    };

    self.toggleFullScreen = function() {
        self.fullScreen(!self.fullScreen());
    };

    self.closeModal = () => {
        self.openModal(false);
        self.previewTabStatus('active');
        self.editTabStatus('');

        // Let the validator reset the validation in the form.
        $(self._editForm()).validate().resetForm();
    };

    /* Exhibit Methods */

    self.shouldShowExhibitButton = ko.pureComputed(function() {
        return self._isConnectedToParty();
    });

    self.partyDidChange = (party) => {
        self._isConnectedToParty(!!party);

        // Update everything that isn't on exhibit. This event can
        // be fired from multiple places.
        const exhibitUuid = get(party, 'exhibit.uuid', null);
        self.markAsExhibited(exhibitUuid);
    };

    self.markAsExhibited = (exhibitUuid) => {
        self.mapsOrImages(
            self.mapsOrImages().map(moi => {
                moi.isExhibited(moi.uuid() === exhibitUuid);
                return moi;
            })
        );
    }

    /* Private Methods */

    self._dataHasChanged = async () => {
        if (!self.encounterId()) {
            return;
        }

        const coreUuid = CoreManager.activeCore().uuid();
        const { objects } = await EncounterImage.ps.list({
            coreUuid,
            encounterUuid: self.encounterId()
        });
        self.mapsOrImages(objects);

        const section = self.encounter().sections()[Fixtures.encounter.sections.mapsAndImages.index];
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());
    };
}

ko.components.register('maps-and-images-section', {
    viewModel: MapsAndImagesSectionViewModel,
    template: template
});
