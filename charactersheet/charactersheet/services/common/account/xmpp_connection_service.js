'use strict';
/*eslint no-console:0*/

/**
 * The default configuration object. Use this as a template for creating
 * custom configurations.
 */
var XMPPServiceDefaultConfig = {
    url: 'http://chat.adventurerscodex.com:5280/http-bind/',

    connection: {
        // Specify a custom callback here.
        callback: null
    },

    credentialsHelper: function() {
        var bareJID = UserServiceManager.sharedService().user().xmpp.jid;
        var resource = CharacterManager.activeCharacter().key();
        return {
            jid: bareJID + '/' + resource,
            password: PersistenceService.findAll(AuthenticationToken)[0]
        };
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
var XMPPService = new SharedServiceManager(_XMPPService, XMPPServiceDefaultConfig);


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
        // Namespace config
        Strophe.addNamespace('HTML', 'http://jabber.org/protocol/xhtml-im');
        Strophe.addNamespace('BODY', 'http://www.w3.org/1999/xhtml');

        Strophe.addNamespace('JSON', 'urn:xmpp:json:0');
        Strophe.addNamespace('ACTIVE', 'http://jabber.org/protocol/chatstates');

        Strophe.addNamespace('ATOM', 'http://www.w3.org/2005/Atom');
        Strophe.addNamespace('DELAY', 'urn:xmpp:delay');
        Strophe.addNamespace('RSM', 'http://jabber.org/protocol/rsm');

        // Set up the connection.
        var connection = new Strophe.Connection(self.configuration.url);
        var callback = self.configuration.connection.callback || self._connectionHandler;
        self.connection = connection;

        // Finish setup after user has been confirmed.
        Notifications.user.exists.add(self._handleLogin);
    };

    /* Private Methods */

    self._shouldLog = function() {
        return self.configuration.fallbackAction == 'log';
    };

    self._shouldThrow = function() {
        return self.configuration.fallbackAction == 'throw';
    };

    self._handleLogin = function() {
        var credentials = self.configuration.credentialsHelper();
        var callback = self.configuration.connection.callback || self._connectionHandler;
        self.connection.connect(credentials.jid, credentials.password, callback);
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
        if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
            if (self._shouldLog() && 'console' in window) {
                console.log('Connected.');
            }

            // Send initial presence.
            // https://xmpp.org/rfcs/rfc3921.html#presence
            self.connection.send($pres().tree());

            Notifications.xmpp.connected.dispatch();
        } else if (status === Strophe.Status.DISCONNECTED) {
            if (self._shouldLog() && 'console' in window) {
                console.log('Disconnected.');
            }
            Notifications.xmpp.disconnected.dispatch();
        }
        // Add more logging...
    };
}
