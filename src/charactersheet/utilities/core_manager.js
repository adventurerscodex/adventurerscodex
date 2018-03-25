/*eslint no-console:0 */

import { Core } from 'charactersheet/models/common/core';
import { Notifications } from 'charactersheet/utilities/notifications';
import URI from 'urijs';

/**
 * The Core Manager is responsible for determining and alerting others of
 * changes regarding the current active core that the user wishes to interact
 * with. It is also responsible for setting the current core ID to the URL fragment
 * and parsing the URL fragments at launch.
 */
export var CoreManager = {
    __activeCore__: null,
    CORE_ID_FRAGMENT_KEY: 'c',
    CORE_ID_NULL_FRAGMENT: '',

    /**
     * Do Initial Core Manager Setup.
     *
     * Note: The Core Manager init must be called for the core manager
     * to detect any core IDs in the URL.
     */
    init: () => {
        var fragments = (new URI()).fragment(true);
        var key = fragments[CoreManager.CORE_ID_FRAGMENT_KEY];
        if (key) {
            Core.ps.read({ uuid: key }).then(response => {
                var core = response.object;
                CoreManager._setActiveCore(core);
                Notifications.coreManager.changed.dispatch(core);
            }).catch(err => {
                console.log(err);
            });
        }
    },

    /**
     * Change the active core to the core with the given ID.
     *
     * Note: This method will dispatch notifications to the rest of the app
     * to notify others of this change.
     */
    changeCore: (key) => {
        Core.ps.read({ uuid: key }).then(response => {
            var newCore = response.object;
            try {
                Notifications.coreManager.changing.dispatch(
                    CoreManager.activeCore(),
                    newCore
                );
                CoreManager._setActiveCore(newCore);

                Notifications.coreManager.changed.dispatch(
                    CoreManager.activeCore()
                );
            } catch(err) {
                console.log(err);
            }
        }).catch(err => {
            console.log(err);
        });
    },

    /**
     * Fetch the current Active Core if there is one.
     */
    activeCore: () => {
        if (CoreManager.__activeCore__) {
            return CoreManager.__activeCore__;
        } else {
            return null;
        }
    },

    /**
     * Sets the current URL fragment to the given key, or clears the fragment
     * if the given key is null.
     *
     * Note: Deleting the URL fragment entirely causes a page refresh, so instead
     * we set the fragment to some empty value.
     */
    setActiveCoreFragment: (key) => {
        var uri = new URI();
        uri.removeFragment(CoreManager.CORE_ID_FRAGMENT_KEY);

        key = key ? key : CoreManager.CORE_ID_NULL_FRAGMENT;

        uri.addFragment(
            CoreManager.CORE_ID_FRAGMENT_KEY,
            key
        );
        window.location = uri.toString();
    },

    /**
     * Sets the core id fragment in the URL and the full
     * core to internal storage.
     */
    _setActiveCore: (core) => {
        CoreManager.setActiveCoreFragment(core.uuid());
        CoreManager.__activeCore__ = core;
    }
};
