import {
    ArmorClassService,
    ProficiencyService
} from 'charactersheet/services/character';
import {
    HotkeysService,
    StatusService
} from 'charactersheet/services/common';
import {
    CoreManager,
    Notifications,
    TabFragmentManager
} from 'charactersheet/utilities';
import { PlayerTypes } from 'charactersheet/models/common/player_types';
import { Profile } from 'charactersheet/models/character';
import armorSection from 'images/checked-shield.svg';
import battleGear from 'images/tab_icons/battle-gear.svg';
import containerTab from 'images/tab_icons/knapsack.svg';
import exhibitTab from 'images/tab_icons/film-projector.svg';
import healthSection from 'images/nested-hearts.svg';
import inventorySection from 'images/misc_icons/locked-chest.svg';
import inventoryTab from 'images/tab_icons/open-treasure-chest.svg';
import ko from 'knockout';
import notesTab from 'images/tab_icons/quill-ink.svg';
import partyTab from 'images/tab_icons/backup.svg';
import companionsTab from 'images/tab_icons/wyvern.svg';
import profileSection from 'images/standing-man-3.svg';
import profileTab from 'images/tab_icons/read.svg';
import skillSection from 'images/sword-spin.svg';
import skillsTab from 'images/tab_icons/jump-across.svg';
import spellSection from 'images/enlightenment.svg';
import spellsTab from 'images/tab_icons/fire-tail.svg';
import statsTab from 'images/tab_icons/weight-lifting-up.svg';
import template from './index.html';
import weaponSection from 'images/spinning-sword.svg';


export function CharacterRootViewModel(params) {
    var self = this;
    self.activeCharacter = params.activeCharacter;
    self.icons = {
        statsTab: statsTab,
        skillsTab: skillsTab,
        spellsTab: spellsTab,
        inventoryTab: inventoryTab,
        containerTab: containerTab,
        notesTab: notesTab,
        partyTab: partyTab,
        profileTab: profileTab,
        exhibitTab: exhibitTab,
        healthSection: healthSection,
        skillSection: skillSection,
        spellSection: spellSection,
        weaponSection: weaponSection,
        armorSection: armorSection,
        inventorySection: inventorySection,
        profileSection: profileSection,
        battleGear: battleGear,
        companionsTab: companionsTab
    };

    self.playerType = () => {
        const key = CoreManager.activeCore().type.name();
        return PlayerTypes[key];
    };

    self.activeTab = ko.observable();
    self.isConnectedAndInAParty = ko.observable(false);
    self.currentPartyNode = ko.observable(null);
    self.wellState = ko.observable(false);

    /* Services */

    self.statusLineService = StatusService.sharedService();
    self.proficiencyService = ProficiencyService.sharedService();
    self.armorClassService = ArmorClassService.sharedService();

    /* Tooltips */

    self.profileTooltip = ko.observable('Profile');
    self.statsTooltip = ko.observable('Stats');
    self.skillsTooltip = ko.observable('Skills');
    self.spellsTooltip = ko.observable('Spells');
    self.weaponsAndArmorTooltip = ko.observable('Weapons and Armor');
    self.backpackTooltip = ko.observable('Backpack');
    self.notesTooltip = ko.observable('Notes');
    self.partyTooltip = ko.observable('Party');
    self.exhibitTooltip = ko.observable('Exhibit');

    /* Tab Properties */

    self.profileTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('profile');
    });
    self.statsTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('stats');
    });
    self.skillsTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('skills');
    });
    self.spellsTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('spells');
    });
    self.equipmentTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('equipment');
    });
    self.inventoryTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('inventory');
    });
    self.companionsTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('companions');
    });
    self.notesTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('notes');
    });
    self.partyTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('party');
    });
    self.exhibitTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('exhibit');
    });

    self.activateProfileTab = () => {
        self._setActiveTab('profile');
    };
    self.activateStatsTab = () => {
        self._setActiveTab('stats');
    };
    self.activateSkillsTab = () => {
        self._setActiveTab('skills');
    };
    self.activateSpellsTab = () => {
        self._setActiveTab('spells');
    };
    self.activateEquipmentTab = () => {
        self._setActiveTab('equipment');
    };
    self.activateInventoryTab = () => {
        self._setActiveTab('inventory');
    };
    self.activateCompanionsTab = () => {
        self._setActiveTab('companions');
    };
    self.activateNotesTab = () => {
        self._setActiveTab('notes');
    };
    self.activatePartyTab = () => {
        self._setActiveTab('party');
    };
    self.activateExhibitTab = () => {
        self._setActiveTab('exhibit');
    };

    self.toggleWellOpen = () => {
        self.wellState(!self.wellState());
    };

    self.arrowIconClass = ko.pureComputed(() => {
        return self.wellState() ? 'fa fa-caret-up' : 'fa fa-caret-down';
    });

    /* Public Methods */

    self.load = () => {
        self.activeTab(TabFragmentManager.activeTab());

        $(`.nav-tabs a[href="#${self.activeTab()}"]`).tab('show');

        self.activeTab.subscribe(()=>{
            $(`.nav-tabs a[href="#${self.activeTab()}"]`).tab('show');
        });

        self.statusLineService.init();
        self.proficiencyService.init();
        self.armorClassService.init();

        //Subscriptions
        HotkeysService.registerHotkey('1', self.activateStatsTab);
        HotkeysService.registerHotkey('2', self.activateSkillsTab);
        HotkeysService.registerHotkey('3', self.activateSpellsTab);
        HotkeysService.registerHotkey('4', self.activateEquipmentTab);
        HotkeysService.registerHotkey('5', self.activateInventoryTab);
        HotkeysService.registerHotkey('6', self.activateCompanionsTab);
        HotkeysService.registerHotkey('7', self.activateNotesTab);
        HotkeysService.registerHotkey('8', self.activatePartyTab);
        HotkeysService.registerHotkey('9', self.activateExhibitTab);
    };

    self.unload = () => {
        HotkeysService.flushHotkeys();
    };

    //Private Methods

    self._tabIsVisible = (tabName) => {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };

    self._tabIsVisibleAndConnected = (tabName) => {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1 && self.connected()) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };

    self._updateCurrentNode = (node, success) => {
        self.currentPartyNode(node);
    };

    self._removeCurrentNode = (node, success) => {
        self.currentPartyNode(null);
    };

    self._setActiveTab = (tab) => {
        self.activeTab(tab);
        TabFragmentManager.changeTabFragment(tab);
    };

    self.dispose = () => {
        self.unload();
    };
}

ko.components.register('character-root', {
    viewModel: CharacterRootViewModel,
    template: template
});
