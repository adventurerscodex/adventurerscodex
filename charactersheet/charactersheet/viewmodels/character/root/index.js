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
    CharacterManager,
    Notifications
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

    self.playerType = function() {
        return CharacterManager.activeCharacter().playerType();
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
    self.profileTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('profile');
    });
    self.statsTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('stats');
    });
    self.skillsTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('skills');
    });
    self.spellsTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('spells');
    });
    self.equipmentTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('equipment');
    });
    self.inventoryTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('inventory');
    });
    self.notesTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('notes');
    });
    self.chatTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('chat');
    });
    self.partyTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('party');
    });
    self.exhibitTabStatus = ko.pureComputed(function() {
        return self._tabIsVisible('exhibit');
    });

    self.activateProfileTab = function() {
        self.activeTab('profile');
    };
    self.activateStatsTab = function() {
        self.activeTab('stats');
    };
    self.activateSkillsTab = function() {
        self.activeTab('skills');
    };
    self.activateSpellsTab = function() {
        self.activeTab('spells');
    };
    self.activateEquipmentTab = function() {
        self.activeTab('equipment');
    };
    self.activateInventoryTab = function() {
        self.activeTab('inventory');
    };
    self.activateNotesTab = function() {
        self.activeTab('notes');
    };
    self.activatePartyTab = function() {
        self.activeTab('party');
    };
    self.activateChatTab = function() {
        self.activeTab('chat');
    };
    self.activateExhibitTab = function() {
        self.activeTab('exhibit');
    };

    self.toggleWellOpen = function() {
        self.wellState(!self.wellState());
    };

    self.arrowIconClass = ko.pureComputed(function() {
        return self.wellState() ? 'fa fa-caret-up' : 'fa fa-caret-down';
    });

    //UI Methods

    self.playerSummary = ko.pureComputed(function() {
        self._dummy();
        var summary = '';
        var key = CharacterManager.activeCharacter().key();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                summary = PersistenceService.findBy(Profile, 'characterId', key)[0].characterSummary();
            } catch(err) { /*Ignore*/ }
        }
        return summary;
    });

    self.playerTitle = ko.pureComputed(function() {
        self._dummy();
        var name = '';
        var key = CharacterManager.activeCharacter().key();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                name = PersistenceService.findBy(Profile, 'characterId', key)[0].characterName();
            } catch(err) { /*Ignore*/ }
        }
        return name;
    });

    self.playerAuthor = ko.pureComputed(function() {
        self._dummy();
        var name = '';
        var key = CharacterManager.activeCharacter().key();
        if (self.playerType().key === PlayerTypes.characterPlayerType.key) {
            try {
                name = PersistenceService.findBy(Profile, 'characterId', key)[0].playerName();
            } catch(err) { /*Ignore*/ }
        }
        return name;
    });

    self.pageTitle = ko.pureComputed(function() {
        self._dummy();
        try {
            return self.playerTitle() + ' by ' + self.playerAuthor()
                + ' | Adventurer\'s Codex';
        } catch(err) { /*Ignore*/ }
    });

    //Public Methods

    self.load = function() {
        self.activeTab(self.playerType().defaultTab);

        Notifications.party.joined.add(self._updateCurrentNode);
        Notifications.party.left.add(self._removeCurrentNode);
        Notifications.xmpp.disconnected.add(self._removeCurrentNode);

        self.statusLineService.init();
        self.proficiencyService.init();
        self.armorClassService.init();
        self.characterCardPublishingService.init();

        //Subscriptions
        Notifications.profile.changed.add(function() {
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

    self.unload = function() {
        HotkeysService.flushHotkeys();

        Notifications.party.joined.remove(self._updateCurrentNode);
        Notifications.party.joined.remove(self._removeCurrentNode);
        Notifications.xmpp.disconnected.remove(self._removeCurrentNode);

        self.characterCardPublishingService.deinit();
    };

    //Private Methods

    self._tabIsVisible = function(tabName) {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };

    self._tabIsVisibleAndConnected = function(tabName) {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1 && self.connected()) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };

    self._updateCurrentNode = function(node, success) {
        self.currentPartyNode(node);
    };

    self._removeCurrentNode = function(node, success) {
        self.currentPartyNode(null);
    };

    self.dispose = function() {
        self.unload();
    };
}

ko.components.register('character-root', {
    viewModel: CharacterRootViewModel,
    template: template
});
