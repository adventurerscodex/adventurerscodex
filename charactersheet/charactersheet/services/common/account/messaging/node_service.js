'use strict';
/*eslint no-console:0*/

/**
# Publish Subscribe Node Service

The node service is a global service, contained inside `NodeServiceManager` that
acts as a pubsub node configuration service and an event router for messages
pushed to the client while connected to the server.

The Node service performs a few different responsibilities and each is given its
own section.


## Node Configuration

During application start-up the Node Service connects to the XMPP server and
sets up any new nodes or subscriptions that are required.

To do this, the Node Service looks at the `node_jid` fragment in the current URL
and validates that it is already subscribed to the node, or in the event that it
is not, it requests that it be added to the list of subscribers.


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
            <json route="pcard" compressed="false">
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

### PubSub Item Specification

For an item to be dispatched automatically by the Node Service it must contain
the following attributes.

#### Route

The `route` attribute provides a way for the Node Service to determine the
intended recipient. Routes are determined by individual services and are used by
the Node service to dispatch Notifications.

__NOTE:__ The Node Service expects notifications to already exist at dispatch time and
will not attempt to create them.

Notifications take the form below:

    Notifications.xmpp.routes.ROUTE_ID

View Models and services can use this format to listen for events in routes that
interest them. In all cases, the argument passed to the Notification signals is
the received event XML node.


#### Compressed

This attribute tells the receiving Node Service that the contents are
compressed and cannot be used in their current form.

Values are `true` and `false`.

__NOTE:__ If this attribute is present the item MUST also contain an attribute
detailing the kind of compression used by including a `compression` attribute.

__Example__

    <json route="pcard" compressed="true" compression="gzip">
        compressed json data
    </json>

 */

/**
 * The default configuration object for the Node service.
 */
var NodeServiceConfiguration = {
    compression: {
        'lz-string': {
            compress: function(string) {
                return LZString.compressToUTF16(string);
            },
            decompress: function(data) {
                return LZString.decompressFromUTF16(data);
            }
        }
    },
    defaultNodeOptions: {
        'pubsub#publish_model': 'subscribers'
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
        Notifications.chat.member.joined.add(self._getCards);
        Notifications.party.joined.add(self._getCards);
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
        }).c('item').c('json', attrs, item);
        xmpp.connection.sendIQ(iq.tree(), onsuccess, onerror);
    };

    /* Private Methods */

    self._handleEvent = function(event) {
        try {
            var items = $(event).find('items').children().toArray();
            items.forEach(function(item, idx, _) {
                var json = $(item).find('json');
                var route = $(json).attr('node');
                if (!route) { return; }

                route = route.split('#')[1];
                if (!route) { return; }

                var dispatchRouteExists = Notifications.xmpp.routes[route] || false;
                if (route && dispatchRouteExists) {
                    var content = self._getMessageContent(json);
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
            var xItem = $(receivedPresence).find('x item')[0];
            if (!xItem) {
                return true;
            }
            var jid = $(xItem).attr('jid');
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

    self._getCards = function(response) {
        var chat = ChatServiceManager.sharedService();
        var partyId = chat.currentPartyNode;
        if (partyId == null || !chat.rooms[partyId]) { return; }
        var roster = Object.keys(chat.rooms[partyId].roster);
        if (roster.length < 1) { return; }
        roster.forEach(function(member, idx, _) {
            self._getItemsFromNode(member + '@adventurerscodex.com', 'pcard', self._handleEvent, null);
        });
    };

    self._getMessageContent = function(node) {
        var isCompressed = node.attr('compressed').toLowerCase();

        var contents = null;
        if (isCompressed == 'true') {
            var compression = node.attr('compression').toLowerCase();
            contents = self._decompressContents(node.text(), compression);
        } else {
            contents = node.text();
        }
        return JSON.parse(contents);
    };

    self._decompressContents = function(data, compression) {
        return self.config.compression[compression].decompress(data);
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
