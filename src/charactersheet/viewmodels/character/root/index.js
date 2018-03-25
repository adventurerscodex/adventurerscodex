import {
    ArmorClassService,
    ProficiencyService
} from 'charactersheet/services/character';
import {
    CharacterCardPublishingService,
    HotkeysService,
    StatusService
} from 'charactersheet/services/common';
import {
    CoreManager,
    Notifications,
    TabFragmentManager
} from 'charactersheet/utilities';
import { ChatServiceManager } from 'charactersheet/services/common';
import armorSection from 'images/checked-shield.svg';
import battleGear from 'images/tab_icons/battle-gear.svg';
import chatTab from 'images/tab_icons/conversation.svg';
import exhibitTab from 'images/tab_icons/film-projector.svg';
import healthSection from 'images/nested-hearts.svg';
import inventorySection from 'images/misc_icons/locked-chest.svg';
import inventoryTab from 'images/tab_icons/knapsack.svg';
import ko from 'knockout';
import notesTab from 'images/tab_icons/quill-ink.svg';
import profileSection from 'images/standing-man-3.svg';
import profileTab from 'images/tab_icons/read.svg';
import skillSection from 'images/sword-spin.svg';
import skillsTab from 'images/tab_icons/jump-across.svg';
import spellSection from 'images/enlightenment.svg';
import spellsTab from 'images/tab_icons/fire-tail.svg';
import statsTab from 'images/tab_icons/weight-lifting-up.svg';
import template from './index.html';
import weaponSection from 'images/spinning-sword.svg';


export function CharacterRootViewModel() {
    var self = this;

    self.icons = {
        statsTab: statsTab,
        skillsTab: skillsTab,
        spellsTab: spellsTab,
        inventoryTab: inventoryTab,
        notesTab: notesTab,
        profileTab: profileTab,
        chatTab: chatTab,
        exhibitTab: exhibitTab,
        healthSection: healthSection,
        skillSection: skillSection,
        spellSection: spellSection,
        weaponSection: weaponSection,
        armorSection: armorSection,
        inventorySection: inventorySection,
        profileSection: profileSection,
        battleGear: battleGear
    };

    self.playerType = () => {
        return CoreManager.activeCore().playerType();
    };
    self._dummy = ko.observable(false);
    self.activeTab = ko.observable();
    self.isConnectedAndInAParty = ko.observable(false);
    self.currentPartyNode = ko.observable(null);
    self.wellState = ko.observable(false);

    // Services
    self.statusLineService = StatusService.sharedService();
    self.proficiencyService = ProficiencyService.sharedService();
    self.armorClassService = ArmorClassService.sharedService();
    self.characterCardPublishingService = CharacterCardPublishingService.sharedService();

    //Tooltips
    self.profileTooltip = ko.observable('Profile');
    self.statsTooltip = ko.observable('Stats');
    self.skillsTooltip = ko.observable('Skills');
    self.spellsTooltip = ko.observable('Spells');
    self.weaponsAndArmorTooltip = ko.observable('Weapons and Armor');
    self.backpackTooltip = ko.observable('Backpack');
    self.notesTooltip = ko.observable('Notes');
    self.partyTooltip = ko.observable('Party');
    self.chatTooltip = ko.observable('Chat');
    self.exhibitTooltip = ko.observable('Exhibit');

    //Tab Properties
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
    self.notesTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('notes');
    });
    self.chatTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('chat');
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
    self.activateNotesTab = () => {
        self._setActiveTab('notes');
    };
    self.activatePartyTab = () => {
        self._setActiveTab('party');
    };
    self.activateChatTab = () => {
        self._setActiveTab('chat');
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

    //UI Methods

    self.playerSummary = ko.pureComputed(() => {
        self._dummy();
        var summary = '';
        var key = CoreManager.activeCore().uuid();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                summary = PersistenceService.findBy(Profile, 'characterId', key)[0].characterSummary();
            } catch(err) { /*Ignore*/ }
        }
        return summary;
    });

    self.playerTitle = ko.pureComputed(() => {
        self._dummy();
        var name = '';
        var key = CoreManager.activeCore().uuid();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                name = PersistenceService.findBy(Profile, 'characterId', key)[0].characterName();
            } catch(err) { /*Ignore*/ }
        }
        return name;
    });

    self.playerAuthor = ko.pureComputed(() => {
        self._dummy();
        var name = '';
        var key = CoreManager.activeCore().uuid();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                name = PersistenceService.findBy(Profile, 'characterId', key)[0].playerName();
            } catch(err) { /*Ignore*/ }
        }
        return name;
    });

    self.pageTitle = ko.pureComputed(() => {
        self._dummy();
        try {
            return self.playerTitle() + ' by ' + self.playerAuthor()
                + ' | Adventurer\'s Codex';
        } catch(err) { /*Ignore*/ }
    });

    //Public Methods

    self.load = () => {
        self.activeTab(TabFragmentManager.activeTab());

        Notifications.party.joined.add(self._updateCurrentNode);
        Notifications.party.left.add(self._removeCurrentNode);
        Notifications.xmpp.disconnected.add(self._removeCurrentNode);

        self.statusLineService.init();
        self.proficiencyService.init();
        self.armorClassService.init();
        self.characterCardPublishingService.init();

        //Subscriptions
        Notifications.profile.changed.add(() => {
            self._dummy.valueHasMutated();
        });

        HotkeysService.registerHotkey('1', self.activateStatsTab);
        HotkeysService.registerHotkey('2', self.activateSkillsTab);
        HotkeysService.registerHotkey('3', self.activateSpellsTab);
        HotkeysService.registerHotkey('4', self.activateEquipmentTab);
        HotkeysService.registerHotkey('5', self.activateInventoryTab);
        HotkeysService.registerHotkey('6', self.activateNotesTab);
        HotkeysService.registerHotkey('7', self.activateProfileTab);
        HotkeysService.registerHotkey('8', self.activateChatTab);
        HotkeysService.registerHotkey('9', self.activateExhibitTab);

    };

    self.unload = () => {
        HotkeysService.flushHotkeys();

        Notifications.party.joined.remove(self._updateCurrentNode);
        Notifications.party.joined.remove(self._removeCurrentNode);
        Notifications.xmpp.disconnected.remove(self._removeCurrentNode);

        self.characterCardPublishingService.deinit();
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
