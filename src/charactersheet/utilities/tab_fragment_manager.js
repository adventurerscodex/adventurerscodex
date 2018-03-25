import { CoreManager } from 'charactersheet/utilities/core_manager';
import { Notifications } from 'charactersheet/utilities/notifications';
import URI from 'urijs';

export var TabFragmentManager = {
    __active_tab__: null,
    TAB_FRAGMENT_KEY: 't',
    TAB_NULL_FRAGMENT: '',

    /**
     * Do Initial Tab Manager Setup.
     *
     * Note: The Tab Manager init must be called for the tab manager
     * to detect any character IDs in the URL.
     */
    init: () => {
        const fragments = (new URI()).fragment(true);
        const tab = fragments[TabFragmentManager.TAB_FRAGMENT_KEY];
        const character = CoreManager.activeCore();
        if (!character) {
            return;
        }

        const tabIsValid = character.playerType().visibleTabs.indexOf(tab) > -1;
        if (tab && tabIsValid) {
            TabFragmentManager.changeTabFragment(tab);
        } else {
            TabFragmentManager.changeTabFragment(character.playerType().defaultTab);
        }
    },

    changeTabFragment: (tab) => {
        TabFragmentManager._setActiveTabFragment(tab);
        TabFragmentManager.__active_tab__ = tab;
    },

    activeTab: () => {
        if (TabFragmentManager.__active_tab__) {
            return TabFragmentManager.__active_tab__;
        } else {
            const character = CoreManager.activeCore();
            return character.playerType().defaultTab;
        }
    },

    _setActiveTabFragment: (tab) => {
        var uri = new URI();
        uri.removeFragment(TabFragmentManager.TAB_FRAGMENT_KEY);

        tab = tab ? tab : TabFragmentManager.TAB_NULL_FRAGMENT;

        uri.addFragment(
            TabFragmentManager.TAB_FRAGMENT_KEY,
            tab
        );
        window.location = uri.toString();
    }
};
