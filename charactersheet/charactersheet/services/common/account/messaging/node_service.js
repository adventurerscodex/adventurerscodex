'use strict';
/*eslint no-console:0*/

/**
# Publish Subscribe Node Service

The node service is a global service, contained inside `NodeServiceManager` that
acts as a pubsub node configuration service and an event router for messages
pushed to the client while connected to the server.


## Node Configuration

During application start-up the Node Service connects to the XMPP server and
sets up any new nodes or subscriptions that are required.


## Routing

The `route` attribute provides a way for the Services Layer to determine the
intended recipient. Routes are determined by individual services and are used by
the Node service to dispatch Notifications.

Notifications take the form below:

    Notifications.xmpp.routes.ROUTE_ID

Routes are determined by the node namespace. For example:

    <item xmlns="urn:xmpp:json:0#pcard" ...>

Will route to the pcard listeners.


## Incoming Event Dispatch

Once its configuration is complete, the Node service sets up handlers to all
existing subscriptions so that it will be notified of incoming events on
any channel that the user has chosen to receive them.

These incoming events are routed to the `Notifications` system by an attribute on
the incoming pubsub element like so:

    <message from='pubsub.shakespeare.lit' to='francisco@denmark.lit' id='foo'>
      <event xmlns='http://jabber.org/protocol/pubsub#event'>
        <items node='princely_musings'>
          <item id='ae890ac52d0df67ed7cfdf51b644e901'>
            <json compressed="false">
                {
                    'playerNane': 'Bob Anderson',
                    'name': 'Arron Cubekiller',
                    ...
                }
            </json>
          </item>
        </items>
      </event>
    </message>

Any element without a routing attribute is ignored.

For more information on the JSON element spec and payload, @see JSONPayload.
 */

/**
 * The default configuration object for the Node service.
 */
var NodeServiceConfiguration = {
    defaultNodeOptions: {
    }
};

/**
 * The shared instance manager for the Node Service.
 */
var NodeServiceManager = new SharedServiceManager(_NodeService, NodeServiceConfiguration);

/**
 * An internal service implementation that holds onto data regarding the
 * creation, subscriptions, un-subscriptions, and deleting nodes.
 */
function _NodeService(config) {
    var self = this;

    /**
     * A configuration object that can be used to set options at initialization-time.
     * Changes to this object after such time requires a rebuild of the service.
     */
    self.config = config;

    self.init = function() {
        // Subscribe to all push events.
        var xmpp = XMPPService.sharedService();
        xmpp.connection.addHandler(self._handleEvent, null, 'message', null, null, null);
        xmpp.connection.addHandler(self._handlePresenceRequest, null, 'presence', 'subscribe');
        xmpp.connection.addHandler(self._handlePresence, null, 'presence');
        xmpp.connection.addHandler(self._handleSuccessfulPresenceSubscription, null, 'presence', 'subscribed');
        Notifications.party.roster.changed.add(self._getCards);
    };

    /**
     * Returns the default node configuration as specified by the initial config.
     */
    self.getDefaultNodeOptions = function() {
        return self.config.defaultNodeOptions;
    };

    self.publishItem = function(item, attrs, route, onsuccess, onerror) {
        var xmpp = XMPPService.sharedService();
        // Refuse to publish if the connection is not established.
        if (!xmpp.connection.connected) { return; }
        var iq = $iq({
            from: Strophe.getBareJidFromJid(xmpp.connection.jid),
            type: 'set',
            id: xmpp.connection.getUniqueId()
        }).c('pubsub', {
            xmlns: Strophe.NS.PUBSUB
        }).c('publish', {
            node: Strophe.NS.JSON + '#' + route
        }).c('item').cnode(JSONPayload.getElement(item, attrs).node);
        xmpp.connection.sendIQ(iq.tree(), onsuccess, onerror);
    };

    /* Private Methods */

    self._handleEvent = function(event) {
        try {
            var items = $(event).find('items').children().toArray();
            var route = $(event).find('items').attr('node');
            if (!route) { return; }
            route = route.split('#')[1];
            if (!route) { return; }

            items.forEach(function(item, idx, _) {
                var json = $(item).find('json');
                var dispatchRouteExists = Notifications.xmpp.routes[route] || false;
                if (route && dispatchRouteExists) {
                    var content = JSONPayload.getContents(json);
                    Notifications.xmpp.routes[route].dispatch(content);
                }
            });
        } catch(e) {
            console.log(e);
        }
        return true;
    };

    self._handlePresenceRequest = function(presenceRequest) {
        /**eslint no-console:0 */
        try {
            var xmpp = XMPPService.sharedService();
            var from = $(presenceRequest).attr('from');

            // Don't subscribe to self.
            if (from == Strophe.getBareJidFromJid(xmpp.connection.jid)) {
                return true;
            }

            var presence = $pres({
                to: Strophe.getBareJidFromJid($(presenceRequest).attr('from')),
                type: 'subscribed'
            });
            xmpp.connection.send(presence.tree());
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    self._handlePresence = function(receivedPresence) {
        /**eslint no-console:0 */
        try {
            var jid = $(receivedPresence).find('x item').attr('jid');
            if (!jid) {
                return true;
            }

            // Send the presence subscription request.
            var xmpp = XMPPService.sharedService();
            var presence = $pres({
                to: Strophe.getBareJidFromJid(jid),
                from: xmpp.connection.jid,
                type: 'subscribe'
            });
            xmpp.connection.send(presence.tree());
        } catch(err) {
            console.log(err);
        }
        return true;
    };

    self._handleSuccessfulPresenceSubscription = function(response) {
        try {
            var from = $(response).attr('from');
            self._subscribeToNode(Strophe.getBareJidFromJid(from), Strophe.NS.JSON + '#pcard', self._getCards, null);
        } catch(e) {
            console.log(e);
        }
        return true;
    };

    self._getCards = function() {
        var chat = ChatServiceManager.sharedService();
        var partyId = chat.currentPartyNode;
        if (partyId == null || !chat.rooms[partyId]) { return; }
        var roster = Object.keys(chat.rooms[partyId].roster);
        if (roster.length < 1) { return; }
        roster.forEach(function(member, idx, _) {
            self._getItemsFromNode(member + '@adventurerscodex.com', 'pcard', self._handleEvent, null);
        });
    };

    /**
     * Constructs IQ stanza to subscribe to a node.
     *
     * @param toJid  full JID of the node to subscribe to (example@adventurerscodex.com)
     * @param nodeRoute  route to subscribe to (Strophe.NS.JSON + '#pcard')
     * @param onsuccess  method to be invoked once the request is handled successfully
     * @param onerror  method to be invoked if the request returns an error
     */
    self._subscribeToNode = function(toJid, node, onsuccess, onerror) {
        var xmpp = XMPPService.sharedService();
        var iq = $iq({
            from: xmpp.connection.jid,
            to: toJid,
            id: xmpp.connection.getUniqueId(),
            type: 'set'
        }).c('pubsub', {
            xmlns: Strophe.NS.PUBSUB
        }).c('subscribe', {
            node: node,
            jid: Strophe.getBareJidFromJid(xmpp.connection.jid)
        });
        xmpp.connection.sendIQ(iq.tree(), onsuccess, onerror);
    };

    /**
     * Constructs IQ stanza to retrieve items from the given node route.
     *
     * @param toJid  full JID of the node to retrieve items for or someone's JID (example@adventurerscodex.com)
     * @param nodeRoute  route to retrieve items from (pcard)
     * @param onsuccess  method to be invoked once the request is handled successfully
     * @param onerror  method to be invoked if the request returns an error
     */
    self._getItemsFromNode = function(toJid, nodeRoute, onsuccess, onerror) {
        var xmpp = XMPPService.sharedService();
        var iq = $iq({
            from: xmpp.connection.jid,
            to: toJid,
            id: xmpp.connection.getUniqueId(),
            type: 'get'
        }).c('pubsub', {
            xmlns: Strophe.NS.PUBSUB
        }).c('items', {
            node: Strophe.NS.JSON + '#' + nodeRoute
        });
        xmpp.connection.sendIQ(iq.tree(), onsuccess, onerror);
    };
}
