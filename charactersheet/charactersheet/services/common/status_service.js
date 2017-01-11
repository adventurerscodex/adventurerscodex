'use strict';

/**
 * A global service that observes changes in various modules, and calculates
 * relevant statuses based on their values. This service works in the background
 * and should not require access from individual modules.
 *
 * Once a status has been changed, or a new one created, statuses are persisted
 * to the application data store, and a Status.changed Notification is dispatched.
 * Use this notification to detect and update your view model's information.
 *
 * Status Service Components
 * -------------------------
 * Calculations for statuses are gathered and configured using status service
 * components. These components listen for changes pertaining to their particular
 * area of interest and generate statuses relating to their function.
 *
 * To add additional status components, create a component and add it to the
 * list of default components in the Fixtures.
 */
var StatusService = {
    _sharedService: null,

    /**
     * Retrieve the current shared status line service. This property is lazily
     * evaluated and, on first use, will initialize a new instance of the service.
     */
    sharedService: function() {
        if (!StatusService._sharedService) {
            StatusService._sharedService = new _StatusService(StatusService.configuration);
        }
        return StatusService._sharedService;
    },

    /**
     * Clear out the current instance of the sharedService. This will cause a
     * reload of the current configuration when the service is next used.
     */
    resetSharedService: function() {
        StatusService._sharedService = null;
    },

    /**
     * A global config object for the underlying status service. Changes to this
     * object do not cause changes to the active service. To update the current
     * service, use the `resetSharedService`.
     *
     * Allowed Options
     * ---------------
     * - components: a list of Status Service Component Objects that calculate
     * active statuses for a given user. Add any components here
     */
    configuration:  {
        components: []
    }
};


/**
 * An internal service implementation that listens for and calculates the
 * current statuses of the current user based on notifications and data from
 * other parts of the system.
 */
function _StatusService(config) {
    var self = this;

    self.config = config;

    self.init = function() {
        for (var i in self.config.components) {
            self.config.components[i].init();
        }
    };
}
