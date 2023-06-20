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
import mapsTabImage from 'images/tab_icons/treasure-map.svg';
import ko from 'knockout';
import notesTabImage from 'images/tab_icons/quill-ink.svg';
import encounterTabImage from 'images/tab_icons/bookmarklet.svg';
import partyTabImage from 'images/tab_icons/backup.svg';
import exhibitTabImage from 'images/tab_icons/film-projector.svg';
import initiativeTabImage from 'images/tab_icons/sword-clash.svg';
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

    self.encounterTabImage = encounterTabImage;
    self.mapsTabImage = mapsTabImage;
    self.dmScreenTabImage = dmScreenTabImage;
    self.notesTabImage = notesTabImage;
    self.partyTabImage = partyTabImage;
    self.exhibitTabImage = exhibitTabImage;
    self.initiativeTrackerTabImage = initiativeTabImage;

    self.subscriptions = [];

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

    self.encounterTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('encounter');
    });

    self.mapsTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('maps');
    });

    self.dmscreenTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('dmscreen');
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

    self.initiativeTrackerTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('initiative');
    });

    self.activateEncounterTab = () => {
        self._setActiveTab('encounter');
    };

    self.activateMapsTab = () => {
        self._setActiveTab('maps');
    };

    self.activateDmScreenTab = () => {
        self._setActiveTab('dmscreen');
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

    self.activateInitiativeTrackerTab = () => {
        self._setActiveTab('initiative');
    };

    //Public Methods

    /**
     * Signal all modules to load their data.
     */
    self.load = () => {
        self.activeTab(TabFragmentManager.activeTab());

        $(`.nav-tabs a[href="#${self.activeTab()}"]`).tab('show');

        self.activeTab.subscribe(()=>{
            $(`.nav-tabs a[href="#${self.activeTab()}"]`).tab('show');
        });

        HotkeysService.registerHotkey('1', self.activateEncounterTab);
        HotkeysService.registerHotkey('2', self.activateMapsTab);
        HotkeysService.registerHotkey('3', self.activateDmScreenTab);
        HotkeysService.registerHotkey('4', self.activateNotesTab);
        HotkeysService.registerHotkey('5', self.activatePartyTab);
        HotkeysService.registerHotkey('6', self.activateExhibitTab);
        HotkeysService.registerHotkey('7', self.activateInitiativeTrackerTab);

        self.subscriptions.push(Notifications.dm.tabShouldChange.add(self._setActiveTab));
    };

    self.unload = () => {
        HotkeysService.flushHotkeys();

        for (const subscription of self.subscriptions) {
            subscription.dispose();
        }
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
