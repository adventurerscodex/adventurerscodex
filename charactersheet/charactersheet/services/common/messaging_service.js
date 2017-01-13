'use strict';

/**
 * A convenience service for sending/receiving messages via the
 * XMPPConnectionService.
 * @author Brian Schrader
 */
var MessagingService = {

    /**
     * The base configuration settings.
     * Register new namespaces and other global settings here.
     */
    configuration: {
        namespaces: {
            pubsub: 'http://jabber.org/protocol/pubsub',
            json: 'urn:xmpp:json:0'
        }
    },

    /**
     * Notifications for various MessagingService events are placed here.
     * They are separated from the global notifications system because they
     * should not be used outside of the MessagingService and subscribing to
     * notifications should be done through the `subscribe` API.
     */
    notifications: {},

    /**
     * Initializes the Messaging Service and the underlying XMPPService.
     * This method MUST be invoked prior to using any other methods on the
     * Messaging Service.
     */
    initialize: function() {
        // Namespace config
        Strophe.addNamespace(MessagingService.configuration.namespaces.pubsub);
        Strophe.addNamespace(MessagingService.configuration.namespaces.json);

        var connection = XMPPService.sharedConnection();

        // Handler Management
        MessagingService._handlerToken = connection.addHandler(
            MessagingService._pubsubHandler,
            MessagingService.configuration.namespaces.pubsub,
            null, 'message', null, null, null
        );
    },

    /**
     * Shuts down the XMPPService and unregisters all handlers.
     * This method MUST be invoked before reinitializing.
     */
    deinitialize: function() {
        var connection = XMPPService.sharedConnection();
        connection.removeHandler(MessagingService._handlerToken);

        // Dump all handlers.
        var keys = Object.keys(MessagingService.notifications);
        for (var i=0; i<keys.length; i++) {
            MessagingService.notifications[key].removeAll();
            MessagingService.notifications[key].dispose();
            MessagingService.notifications[key] = undefined;
        }
    },

    /* Account Management */

    login: function() {
        //TODO
    },

    logout: function() {
        //TODO
    },

    /* Error Handling Methods */

    /**
     * Add a handler for error stanzas.
     *
     * @param callback: The handler function to be called. This function should
     * accept a single stanza argument.
     * @returns A token that is used to remove the handler.
     */
    addErrorHandler: function(error) {
        var connection = XMPPService.sharedConnection();
        return connection.addHandler(callback, null, 'error', type, null, from, null);
    },

    /* Presence Management */

    addGlobalPresence: function(to, show, status, priority) {
        var connection = XMPPService.sharedConnection();

        var presence = $pres({
            from: connection.jid,
            to: to,
            id: connection.getUniqueId()
        }).c('show').t(show).up()
        .c('status').t(status).up()
        .c('priority').t(priority);

        connection.send(presence.tree());
    },

    /* Status Publishing/Subscribing */

    /*
     * This section follows the PubSub protocol defined in the XMPP XEP-0060
     * - http://www.xmpp.org/extensions/xep-0060.html#intro-overview
     *
     * Additional information found here:
     * - http://blog.fanout.io/2013/10/09/publishing-json-over-xmpp/
     * - https://www.ejabberd.im/mod_pubsub-usage
     */

    /**
     * Publish a new data object with a given identifier. This is used to send
     * data to all members of a given group.
     *
     * @param identifier A string identifier that other clients can use to
     * subscribe to these events. This identifier should be unique for each type
     * of data that a client sends.
     * @param data A Javascript object containing the data that is to be sent to
     * all other connected members.
     * @param onsuccess An optional callback to be called when the server
     * acknowledges a new published message.
     * @param onerror An optional callback to be called when the server has
     * encountered an error with the request and failed to save or send out
     * the sent data.
     */
    publish: function(identifier, data, onsuccess, onerror) {
        var connection = XMPPService.sharedConnection();

        var iq = $iq({
            'type': 'set',
            'from': connection.jid,
            'to':  '', //TODO Add server JID
            'id': connection.getUniqueId()
        }).c('pubsub', {
            xmlns: MessagingService.configuration.namespaces.pubsub
        }).c('publish', {
            node: XMPPService.configuration.pubsubNode,
            jid: connection.jid
        }).c('item', {
            id: connection.getUniqueId()
        }).c('json', {
            xmlns: MessagingService.configuration.namespaces.json,
            identifier: identifier
        }).t(JSON.stringify(data));

        connection.sendIQ(iq.tree(), onsuccess, onerror, 3000);
    },

    subscribe: function(identifier, callback) {
        if (!MessagingService.notifications[identifier]) {
            MessagingService.notifications[identifier] = new signals.Signal();
        }
        MessagingService.notifications[identifier].add(callback);
    },

    unsubscribe: function(identifier, handlerToken) {
        MessagingService.notifications[identifier].remove(handlerToken);
    },

    /* Message Send/Receive */

    /**
     * Sends a given plaintext message to the user/room with the given
     * JID.
     *
     * Reference Material:
     * - http://xmpp.org/extensions/xep-0045.html#enter-muc
     *
     * @param message: The message to send.
     * @param type: The message type. Typically: 'groupchat', 'chat', or 'headline'.
     * @param to: The JID (bare or full) of the user/room that the message
     * should be sent to.
     */
    send: function(to, type, msg) {
        var connection = XMPPService.sharedConnection();
        var message = $msg({
            to: to,
            from: connection.jid,
            id: connection.getUniqueId(),
            type: type
        }).c('body').t(msg);
        connection.send(message.tree());
    },

    /**
     * Add a handler for message stanzas from a given user with a given type.
     *
     * @param from: The user JID to listen for.
     * @param type: The message type.
     * @param callback: The handler function to be called. This function should
     * accept a single stanza argument.
     * @returns A token that is used to remove the handler.
     */
    addHandler: function(from, type, callback) {
        var connection = XMPPService.sharedConnection();
        return connection.addHandler(callback, null, 'message', type, null, from, null);
    },

    /**
     * Removes the handler, represented by the given handlerToken from being
     * notified of new incoming messages.
     * @param token: The handler token for a given handler, received when
     * adding the handler.
     */
    removeHandler: function(token) {
        var connection = XMPPService.sharedConnection();
        return connection.removeHandler(token);
    },

    /* Private Methods */

    _handlerToken: null,

    _pubsubHandler: function(stanza) {
        var xjson = msg.getElementsByTagName('json');
        if (!xjson.length > 0) { return true; }

        var data = JSON.parse(Strophe.getText(xjson[0]));
        var identifier = xjson[0].attributes.getNamedItem('identifier').value;

        // Dispatch the parsed data in a notification.
        if (MessagingService.notifications[identifier]) {
            MessagingService.notifications[identifier].dispatch(data);
        }
        return true;
    }
};
