'use strict';
/*eslint no-console:0*/

/**
 * The default configuration object. Use this as a template for creating
 * custom configurations.
 */
var defaultConfig = {
    url: 'http://chat.adventurerscodex.com:5280/http-bind/',

    connection: {
        /* A list of all valid options are located here:
         * http://strophe.im/strophejs/doc/1.2.10/files/strophe-js.html#Strophe.Connection.connect
         */
        jid: 'tester@adventurerscodex.com',
        pass: 'etheekne',

        // Specify a custom callback here.
        callback: null
    },

    //Options: throw, log, none
    fallbackAction: 'log'
};


/**
 * A global connection manager service.
 *
 * A single, shared connection to the XMPP server is shared across
 * the application instance, and can be accessed via `sharedConnection`.
 */
var XMPPService = new SharedServiceManager(_XMPPService, defaultConfig);


function _XMPPService(config) {
    var self = this;

    /**
     * Custom configurations for a connection should be provided before
     * the connection is established.
     */
    self.configuration = config;

    self.connection = null;

    /**
     * A lazily instantiated connection to the XMPP backend server.
     * The first attempt to fetch this connection will instantiate
     * and attempt to connect the user to the given XMPP backend.
     * This means that the first call to this property will take time
     * as connections are established.
     *
     * If a connection fails, the fallback action is determined by the
     * configuration settings for the service.
     */
    self.init = function() {
        var connection = new Strophe.Connection(self.configuration.url);

        var callback = self.configuration.connection.callback || self._connectionHandler;
        connection.connect(
            self.configuration.connection.jid,
            self.configuration.connection.pass,
            callback
        );

        self.connection = connection;
    },

    /* Private Methods */

    self._shouldLog = function() {
        return self.configuration.fallbackAction == 'log';
    };

    self._shouldThrow = function() {
        return self.configuration.fallbackAction == 'throw';
    };

    self._connectionHandler = function(status, error) {
        if (error) {
            if (self._shouldLog()) {
                if ('console' in window) {
                    console.log(error);
                }
            } else if (self._shouldThrow()) {
                throw error;
            }
        }
        if (status === Strophe.Status.CONNECTED) {
            if (self._shouldLog() && 'console' in window) {
                console.log('Connected.');
            }
            Notifications.xmpp.connected.dispatch();
        } else if (status === Strophe.Status.DISCONNECTED) {
            if (self._shouldLog() && 'console' in window) {
                console.log('Disconnected.');
            }
            Notifications.xmpp.disconnected.dispatch();
        }
    };
};
