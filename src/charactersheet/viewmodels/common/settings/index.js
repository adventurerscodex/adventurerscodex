import autoBind from 'auto-bind';
import { Notifications } from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { UserServiceManager } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';

export class SettingsViewModel extends ViewModel {

    isActivePatron = ko.observable(false);

    constructor(params) {
        super(params);

        this.isOpen = params.isOpen;
        this.core = params.core;

        autoBind(this);
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(
            Notifications.user.exists.add(this.userDidChange)
        );
        this.userDidChange();
    }

    SETTING_NAMES = {
        showNotesTab: "Notes",
        showPartyTab: "Party",
        showExhibitTab:"Exhibit",
        showEncounterTab: "Encounters",
        showMapsImagesTab: "Maps & Images",
        showDmscreenTab: "DM Screen",
        showInitiativeTab: "Initiative",
        showStatsTab: "Stats",
        showSkillsTab: "Skills",
        showSpellsTab: "Spells",
        showEquipmentTab: "Equipment",
        showInventoryTab: "Inventory",
        showCompanionsTab: "Companions",
    };

    // This sets the order of the tab fields.
    SETTINGS_TABS = [
        "showEncounterTab",
        "showMapsImagesTab",
        "showDmscreenTab",
        "showInitiativeTab",
        "showStatsTab",
        "showSkillsTab",
        "showSpellsTab",
        "showEquipmentTab",
        "showInventoryTab",
        "showCompanionsTab",
        "showNotesTab",
        "showPartyTab",
        "showExhibitTab",
    ];

    getSettingName(setting) {
        return this.SETTING_NAMES[setting];
    }

    async save() {
        await this.core().ps.save();
        Notifications.coreManager.changed.dispatch(core);
        this.isOpen(false);
    }

    // Events

    userDidChange() {
        const user = UserServiceManager.sharedService().user();
        if (user) {
            this.isActivePatron(user.isActivePatron);
        }
    }
}

ko.components.register('settings', {
    viewModel: SettingsViewModel,
    template: template
});
