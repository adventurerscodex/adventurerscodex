import 'bin/knockout-custom-loader';
import { CharacterManager,
    Notifications } from 'charactersheet/utilities';
import { ChatServiceManager,
    DMCardPublishingService,
    HotkeysService,
    ImageServiceManager,
    PersistenceService
 } from 'charactersheet/services';
import { Campaign } from 'charactersheet/models/dm';
import URI from 'urijs';
import chatTabImage from 'images/tab_icons/conversation.svg';
import dmScreenTabImage from 'images/tab_icons/gift-of-knowledge.svg';
import encounterTabImage from 'images/tab_icons/treasure-map.svg';
import ko from 'knockout';
import notesTabImage from 'images/tab_icons/quill-ink.svg';
import overviewTabImage from 'images/tab_icons/bookmarklet.svg';
import partyTabImage from 'images/tab_icons/backup.svg';
import template from './index.html';


export function DMRootViewModel() {
    var self = this;

    self.TAB_FRAGMENT_KEY = 't';
    self.TAB_NULL_FRAGMENT = '';

    self.playerType = () => {
        return CharacterManager.activeCharacter().playerType();
    };
    self._dummy = ko.observable(false);
    self.activeTab = ko.observable();
    self.isConnectedAndInAParty = ko.observable(false);
    self.currentPartyNode = ko.observable(null);
    self.TEMPLATE_FILE = 'dm/index.tmpl';

    self.dmCardService = DMCardPublishingService.sharedService();
    self.imageService = ImageServiceManager.sharedService();

    self.overviewTabImage = overviewTabImage;
    self.encounterTabImage = encounterTabImage;
    self.dmScreenTabImage = dmScreenTabImage;
    self.notesTabImage = notesTabImage;
    self.partyTabImage = partyTabImage;
    self.chatTabImage = chatTabImage;

   //UI Methods

    self.playerSummary = ko.pureComputed(() => {
        var key = CharacterManager.activeCharacter().key();
        var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        return campaign.summary() ? campaign.summary() : '';
    });

    self.playerTitle = ko.pureComputed(() => {
        var key = CharacterManager.activeCharacter().key();
        var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', key);
        return campaign.name() ? campaign.name() : '';
    });

    self.playerAuthor = ko.pureComputed(() => {
        var key = CharacterManager.activeCharacter().key();
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
    self.chatTabStatus = ko.pureComputed(() => {
        return self._tabIsVisible('chat');
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

    self.activateChatTab = () => {
        self._setActiveTab('chat');
    };

    self.activateNotesTab = () => {
        self._setActiveTab('notes');
    };

    //Public Methods

    /**
     * Signal all modules to load their data.
     */
    self.load = () => {
        self._initActiveTab();

        Notifications.party.joined.add(self._updateCurrentNode);
        Notifications.party.left.add(self._removeCurrentNode);
        Notifications.xmpp.disconnected.add(self._removeCurrentNode);

        HotkeysService.registerHotkey('1', self.activateOverviewTab);
        HotkeysService.registerHotkey('2', self.activateEncounterTab);
        HotkeysService.registerHotkey('3', self.activateDmScreenTab);
        HotkeysService.registerHotkey('4', self.activateNotesTab);
        HotkeysService.registerHotkey('5', self.activatePartyTab);
        HotkeysService.registerHotkey('6', self.activateChatTab);

        self.dmCardService.init();
        self.imageService.init();
    };

    self.unload = () => {
        HotkeysService.flushHotkeys();

        Notifications.xmpp.pubsub.subscribed.remove(self._updateCurrentNode);
        Notifications.xmpp.pubsub.unsubscribed.remove(self._removeCurrentNode);
        Notifications.xmpp.disconnected.remove(self._removeCurrentNode);

        self.dmCardService.deinit();
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

        // Save the current tab in the URL.
        var uri = new URI();
        uri.removeFragment(self.TAB_FRAGMENT_KEY);
        tab = tab ? tab : self.TAB_NULL_FRAGMENT;
        uri.addFragment(
            self.TAB_FRAGMENT_KEY,
            tab
        );
        window.location = uri.toString();
    };

    self._initActiveTab = () => {
        const fragments = (new URI()).fragment(true);
        const tab = fragments[self.TAB_FRAGMENT_KEY];
        const tabIsValid = self.playerType().visibleTabs.indexOf(tab) > -1;
        if (tab && tabIsValid) {
            self._setActiveTab(tab);
        } else {
            self.activeTab(self.playerType().defaultTab);
        }
    };
    self.dispose = () => {
        self.unload();
    };
}

ko.components.register('dm-root', {
    viewModel: DMRootViewModel,
    template: template
});
