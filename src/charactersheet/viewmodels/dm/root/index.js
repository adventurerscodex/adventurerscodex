import 'bin/knockout-custom-loader';
import {
    CoreManager,
    Notifications,
    TabFragmentManager
} from 'charactersheet/utilities';
import {
    HotkeysService,
    PersistenceService
} from 'charactersheet/services';
import { Campaign } from 'charactersheet/models/dm';
import { PlayerTypes } from 'charactersheet/models/common/player_types';
import dmScreenTabImage from 'images/tab_icons/gift-of-knowledge.svg';
import encounterTabImage from 'images/tab_icons/treasure-map.svg';
import ko from 'knockout';
import notesTabImage from 'images/tab_icons/quill-ink.svg';
import overviewTabImage from 'images/tab_icons/bookmarklet.svg';
import partyTabImage from 'images/tab_icons/backup.svg';
import template from './index.html';


export function DMRootViewModel() {
    var self = this;

    self.playerType = () => {
        const key = CoreManager.activeCore().type.name();
        return PlayerTypes[key];
    };
    self._dummy = ko.observable(false);
    self.activeTab = ko.observable();
    self.isConnectedAndInAParty = ko.observable(false);
    self.currentPartyNode = ko.observable(null);
    self.TEMPLATE_FILE = 'dm/index.tmpl';

    self.overviewTabImage = overviewTabImage;
    self.encounterTabImage = encounterTabImage;
    self.dmScreenTabImage = dmScreenTabImage;
    self.notesTabImage = notesTabImage;
    self.partyTabImage = partyTabImage;

    //UI Methods

    self.playerSummary = ko.pureComputed(() => {
        var key = CoreManager.activeCore().uuid();
        var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        return campaign.summary() ? campaign.summary() : '';
    });

    self.playerTitle = ko.pureComputed(() => {
        var key = CoreManager.activeCore().uuid();
        var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        return campaign.name() ? campaign.name() : '';
    });

    self.playerAuthor = ko.pureComputed(() => {
        var key = CoreManager.activeCore().uuid();
        var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        return campaign.playerName() ? campaign.playerName() : '';
    });

    self.pageTitle = ko.pureComputed(() => {
        self._dummy();
        try {
            return self.playerTitle() + ' by ' + self.playerAuthor()
                + ' | Adventurer\'s Codex';
        } catch(err) { /*Ignore*/ }
    });

    // Tab statuses

    self.overviewTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('overview');
    });

    self.encounterTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('encounter');
    });

    self.dmscreenTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('dmscreen');
    });

    self.partyTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('party');
    });

    self.notesTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('notes');
    });

    self.activateOverviewTab = () => {
        self._setActiveTab('overview');
    };

    self.activateEncounterTab = () => {
        self._setActiveTab('encounter');
    };

    self.activateDmScreenTab = () => {
        self._setActiveTab('dmscreen');
    };

    self.activatePartyTab = () => {
        self._setActiveTab('party');
    };

    self.activateNotesTab = () => {
        self._setActiveTab('notes');
    };

    //Public Methods

    /**
     * Signal all modules to load their data.
     */
    self.load = () => {
        self.activeTab(TabFragmentManager.activeTab());

        HotkeysService.registerHotkey('1', self.activateOverviewTab);
        HotkeysService.registerHotkey('2', self.activateEncounterTab);
        HotkeysService.registerHotkey('3', self.activateDmScreenTab);
        HotkeysService.registerHotkey('4', self.activateNotesTab);
        HotkeysService.registerHotkey('5', self.activatePartyTab);
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

ko.components.register('dm-root', {
    viewModel: DMRootViewModel,
    template: template
});
