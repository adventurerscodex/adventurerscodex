'use strict';

/**
 * The default configuration object. Use this as a template for creating
 * custom configurations.
 */
var defaultConfig = {
    hostname: 'localhost',
    port: '8080',
    server: 'irc.freenode.net:6667',
    nickname: 'sonictest1',

    //Options: throw, log, none
    fallbackAction: 'log'
};


/**
 * A global connection manager service.
 *
 * A single, shared connection to the IRC server is shared across
 * the application instance, and can be accessed via `sharedConnection`.
 */
var IRCService = {

    /**
     * Custom configurations for a connection should be provided before
     * the connection is established.
     */
    configuration: defaultConfig,

    /**
     * A lazily instantiated connection to the IRC backend server.
     * The first attempt to fetch this connection will instantiate
     * and attempt to connect the user to the given IRC backend.
     * This means that the first call to this property will take time
     * as connections are established.
     *
     * If a connection fails, the fallback action is determined by the
     * configuration settings for the service.
     */
    sharedConnection: function() {
        if (!IRCService._sharedConnection) {
            var connection = new IRCConnection(IRCService.configuration);
            try {
                connection.connect();
            } catch(err) {
                if (IRCService._shouldLog()) {
                    if ("console" in window) {
                        console.log(err);
                    }
                } else if (IRCService._shouldThrow()) {
                    throw err;
                }
            }
            IRCService._sharedConnection = connection;
        }
        return IRCService._sharedConnection;
    },

    //Private

    _sharedConnection: null,

    _shouldLog: function() {
        return IRCService.configuration.fallbackAction == 'log';
    },

    _shouldThrow: function() {
        return IRCService.configuration.fallbackAction == 'throw';
    },
};


/**
 * An IRC backed messaging service. This service handles sending messages
 * to and from an IRC server. It does NOT handle parsing, or routing messages.
 *
 * When an incoming message is received, an ircConnection
 * notification is sent.
 *
 * It is not recommended to deal with these incoming messages directly.
 * For more useful messaging information, see IRCMessagingService
 *
 * Typically there is only 1 global connection per application. Therefore
 * you should not attempt to use this class directly.
 * Instead, to use the IRC Connection @see IRCService.
 *
 * @author Brian Schrader
 */
function IRCConnection(config) {
    var self = this;

    self.config = config;

    self._connection = null;
    self._templateURL = 'ws://{hostname}:{port}/?' +
        'server={server}&nickname={nickname}';

    /**
     * Given a configuration object, build a web socket connection URL.
     * @returns url {string}
     */
    self._buildConnectionURL = function(config) {
        var url = self._templateURL;
        Object.keys(self.config).forEach(function(prop, i, _) {
            url = url.replace('{' + prop + '}', self.config[prop])
        });
        return url;
    };

    /**
     * Check if the browser can connect using WebSockets.
     */
    self._canOpenWebSockets = function() {
        return ("WebSocket" in window)
    };

    /**
     * Given an incoming message, parse it, and dispatch a notification
     * with the correct contents.
     *
     * Messages have the following format:
     * {
     *    tags: {},
     *    prefix: '',
     *    command: '',
     *    params: [],
     *    timestamp: 0
     * }
     * @sends messageReceived
     */
    self._handleIncomingMessage = function(message) {
        var response = JSON.parse(message.data);
        response.timestamp = message.timeStamp;
        Notifications.ircConnection.messageReceived.dispatch(response);
    };

    /**
     * Given an incoming error, parse it, and dispatch a notification
     * with the correct contents.
     * @sends errorReceived
     */
    self._handleErrorMessage = function(message) {
        var response = JSON.parse(message.data);
        response.timestamp = message.timeStamp;
        Notifications.ircConnection.errorReceived.dispatch(response);
    };

    /**
     * When the connection is opened, dispatch a notification.
     * @sends connectionOpened
     */
    self._handleConnectionOpenedMessage = function(message) {
        Notifications.ircConnection.connectionOpened.dispatch(message);
    };

    /**
     * When the connection is closed, dispatch a notification.
     * @sends connectionClosed
     */
    self._handleConnectionClosedMessage = function(message) {
        Notifications.ircConnection.connectionClosed.dispatch(message);
    };

    /**
     * Initializes the connection, and configures message handlers.
     * to receive incoming messages, subscribe to Notifications.
     *
     * To send a given message over the connection, dispatch the sendMessage
     * notification. Messages must be formatted according to the IRC spec.
     * It is not recommended that users directly send messages via this method.
     * Please use a messaging service to send messages.
     *
     * **Important** Connections are established asynchronously. A successful
     * return from this method does not guarantee that a successful connection
     * was made.
     *
     * @throws If the browser does not support connections via WebSockets.
     */
    self.connect = function() {
        if (!self._canOpenWebSockets()) {
            throw "Browser does not support WebSockets."
        }
        var url = self._buildConnectionURL(self.config);
        self._connection = new WebSocket(url);
        self._connection.onopen = self._handleConnectionOpenedMessage;
        self._connection.onclose = self._handleConnectionClosedMessage;
        self._connection.onmessage = self._handleIncomingMessage;
        self._connection.onerror = self._handleErrorMessage;
    };


    /**
     * A convience method for determining if the connection is open.
     * This method is always safe to call.
     */
    self.isConnected = function() {
        if (self._connection) {
            return self._connection.readyState === 1;
        }
        return false;
    };


    /**
     * Sends a text based message over the underlying connection.
     */
    self.send = function(msg) {
        self._connection.send(msg);
    };
}
