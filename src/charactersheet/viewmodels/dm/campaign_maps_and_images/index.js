import 'bin/knockout-custom-loader';
import {
    SortService,
    PartyService,
} from 'charactersheet/services';
import {
    CoreManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { Image } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './index.html';

export function CampaignMapsAndImagesViewModel() {
    var self = this;

    self.mapsOrImages = ko.observableArray();
    self.blankMapOrImage = ko.observable(new Image());
    self.openModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.convertedDisplayUrl = ko.observable();
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

    self._isConnectedToParty = ko.observable(!!PartyService.party);
    self._addForm = ko.observable();
    self._editForm = ko.observable();

    /* Public Methods */

    self.toggleExhibit = async (image) => {
        image.isExhibited(!image.isExhibited());
        await image.ps.save();
        await self.refresh();
    };

    self.load = async function() {
        Notifications.party.changed.add(self.partyDidChange);

        await self.refresh();
    };

    self.refresh = async function() {
        var key = CoreManager.activeCore().uuid();
        const imagesResponse = await Image.ps.list({coreUuid: key});
        if (imagesResponse.objects) {
            self.mapsOrImages(imagesResponse.objects);
        }
    }

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.closeAddModal = () => {
        self.addModalOpen(false);

        // Let the validator reset the validation in the form.
        $(self._addForm()).validate().resetForm();
    };

    self.closeModal = () => {
        self.openModal(false);
        self.selectPreviewTab();

        // Let the validator reset the validation in the form.
        $(self._editForm()).validate().resetForm();
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
        ...Image.validationConstraints
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
        ...Image.validationConstraints
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
        const imageResponse = await mapOrImage.ps.create();
        self.mapsOrImages.push(imageResponse.object);
        self.toggleAddModal();
        self.blankMapOrImage(new Image());
    };

    self.removeMapOrImage = async function(mapOrImage) {
        await mapOrImage.ps.delete();
        self.mapsOrImages.remove(mapOrImage);
    };

    self.editMapOrImage = function(mapOrImage) {
        self.editItemIndex = mapOrImage.uuid;
        self.currentEditItem(new Image());
        // clear out preview image before rendering the new item
        self.convertedDisplayUrl(null);
        self.currentEditItem().importValues(mapOrImage.exportValues());
        self.convertedDisplayUrl(Utility.string.createDirectDropboxLink(self.currentEditItem().sourceUrl()));
        self.openModal(true);
    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    /* Modal Methods */

    self.addModalFinishedOpening = function() {
        self.firstElementInModalHasFocus(true);
    };

    self.modalFinishedOpening = function() {
        self.selectPreviewTab();
    };

    self.modalFinishedClosing = async function() {
        if (self.openModal()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.mapsOrImages(), response.object, self.editItemIndex);
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

    self.shouldShowPushButton = ko.pureComputed(function() {
        return self._isConnectedToParty();
    });

    /* Private Methods */

    self.partyDidChange = function(party) {
        self._isConnectedToParty(!!party)
    };

    self._dataHasChanged = async function() {
        var key = CoreManager.activeCore().uuid();
        const imagesResponse = await Image.ps.list({coreUuid: key});
        if (imagesResponse.objects) {
            self.mapsOrImages(imagesResponse.objects);
        }
    };
}

ko.components.register('campaign-maps-and-images', {
    viewModel: CampaignMapsAndImagesViewModel,
    template: template
});
