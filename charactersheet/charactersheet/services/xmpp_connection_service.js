'use strict';

/**
 * The default configuration object. Use this as a template for creating
 * custom configurations.
 */
var defaultConfig = {
    url: 'https://jabber.postel.org/http-bind/',

    connection: {
        /* A list of all valid options are located here:
         * http://strophe.im/strophejs/doc/1.2.10/files/strophe-js.html#Strophe.Connection.connect
         */
        jid: 'sonictest1',
        pass: 'test1',

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
var XMPPService = {

    /**
     * Custom configurations for a connection should be provided before
     * the connection is established.
     */
    configuration: defaultConfig,

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
    sharedConnection: function() {
        if (!XMPPService._sharedConnection) {
            var connection = new Strophe.Connection(XMPPService.configuration.url);

            var callback = XMPPService.configuration.connection.callback || XMPPService._connectionHandler;
            connection.connect(
                XMPPService.configuration.connection.jid,
                XMPPService.configuration.connection.pass,
                callback
            );

            XMPPService._sharedConnection = connection;
        }
        return XMPPService._sharedConnection;
    },

    /* Private Methods */

    _sharedConnection: null,

    _shouldLog: function() {
        return XMPPService.configuration.fallbackAction == 'log';
    },

    _shouldThrow: function() {
        return XMPPService.configuration.fallbackAction == 'throw';
    },

    _connectionHandler: function(status, error) {
        if (error) {
            if (XMPPService._shouldLog()) {
                if ("console" in window) {
                    console.log(error);
                }
            } else if (XMPPService._shouldThrow()) {
                throw error;
            }
        }
        if (XMPPService._shouldLog() && "console" in window) {
            console.log("Connection attempted. Response status: " + status);
        }
    }
};
