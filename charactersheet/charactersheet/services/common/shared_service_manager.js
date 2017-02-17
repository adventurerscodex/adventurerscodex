'use strict';

/**
 * A global service that observes changes in account statuses
 * and holds onto the global account state per session.
 */
function SharedServiceManager(sharedServiceType, configuration) {
    var self = this;

    self._sharedService = null;
    self._sharedServiceType = sharedServiceType;
    self._sharedServiceConfig = configuration;

    /**
     * Retrieve the current shared service. This property is lazily
     * evaluated and, on first use, will initialize a new instance of the service.
     */
    self.sharedService = function() {
        if (!self._sharedService) {
            var config = self._sharedServiceConfig || {};
            self._sharedService = new self._sharedServiceType(config);
        }
        return self._sharedService;
    };

    /**
     * Clear out the current instance of the sharedService. This will cause a
     * reload of the current configuration when the service is next used.
     */
    self.resetSharedService = function() {
        self._sharedService = null;
    };
};
