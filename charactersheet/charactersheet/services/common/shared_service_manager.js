'use strict';

/**
 * A global service that observes changes in account statuses
 * and holds onto the global account state per session.
 */
var SharedServiceManager = function(sharedServiceType, configuration) {
    var self = this;

    self._sharedService = null;
    self._sharedServiceType = sharedServiceType;
    self._sharedServiceConfig = configuration;

    /**
     * Retrieve the current shared service. This property is lazily
     * evaluated and, on first use, will initialize a new instance of the service.
     */
    self.sharedService = function() {
        if (!SharedServiceManager._sharedService) {
            var config = self._sharedServiceConfig || {};
            SharedServiceManager._sharedService = new self._sharedServiceType(config);
        }
        return SharedServiceManager._sharedService;
    };

    /**
     * Clear out the current instance of the sharedService. This will cause a
     * reload of the current configuration when the service is next used.
     */
    self.resetSharedService = function() {
        SharedServiceManager._sharedService = null;
    };
};
