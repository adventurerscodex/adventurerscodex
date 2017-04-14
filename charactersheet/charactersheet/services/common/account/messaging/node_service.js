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

        // Finish setup after login is complete.
        Notifications.xmpp.connected.add(self._handleConnect);
    };

    /**
     * Returns a unique id for a new node.
     * Uses nouns and adjectives array from the `DataRepository`.
     */
    self.getUniqueNodeId = function() {
        var adjective = DataRepository['adjectives'][Math.floor(Math.random() * DataRepository['adjectives'].length)];
        var noun = DataRepository['nouns'][Math.floor(Math.random() * DataRepository['nouns'].length)];
        var code = uuid.v4().substr(0,4);
        return adjective + '-' + noun + '-' + code;
    };

    /**
     * Returns the default node configuration as specified by the initial config.
     */
    self.getDefaultNodeOptions = function() {
        return self.config.defaultNodeOptions;
    };

    /* PubSub Methods */

    self.create = function(node, callback) {
        var xmpp = XMPPService.sharedService();
        xmpp.connection.pubsub.createNode(node, self.getDefaultNodeOptions(), function(a) {
            Notifications.xmpp.pubsub.created.dispatch(node);
            callback(a);
        });
    };

    self.subscribe = function(node, onsuccess, onerror) {
        var xmpp = XMPPService.sharedService();
        xmpp.connection.pubsub.subscribe(node, self.getDefaultNodeOptions(),
            self._handleEvent, function(s) {
                Notifications.xmpp.pubsub.subscribed.dispatch(node);
                onsuccess(s);
            }, onerror, null);
    };

    self.unsubscribe = function(node, onsuccess, onerror) {
        var xmpp = XMPPService.sharedService();
        xmpp.connection.pubsub.unsubscribe(node, xmpp.connection.jid, null,
            function(s) {
                Notifications.xmpp.pubsub.unsubscribed.dispatch(node);
                onsuccess(s);
            }, onerror);
    };

    /* Private Methods */

    self._handleConnect = function() {
        // Fetch all outstanding subscriptions.
        // https://xmpp.org/extensions/xep-0060.html#entity-subscriptions
        var xmpp = XMPPService.sharedService();
        // xmpp.connected.pubsub.connect(Settings.PUBSUB_HOST_JID);
        xmpp.connection.pubsub.getSubscriptions(self._handleSubscriptions, 3000);
    };

    self._handleSubscriptions = function(response) {
        var fragments = (new URI()).fragment(true);
        var nodeJID = fragments['node_jid'];

        if (!nodeJID) {
            // There's no node given. Don't try to connect.
            return;
        }

        var subscriptions = $(response).find('subscriptions').children().toArray();
        var subscriptionAlreadyExists = subscriptions.some(function(subscription, idx, _) {
            return (
                $(subscription).attr('node') === nodeJID &&
                $(subscription).attr('subscription') === 'subscribed'
            );
        });

        if (!subscriptionAlreadyExists) {
            var xmpp = XMPPService.sharedService();
            xmpp.connection.pubsub.subscribe(nodeJID, {}, self._handleEvent,
                self._handleSubscriptionSuccess, self._handleSubscriptionError);
        }
    };

    self._handleSubscriptionSuccess = function(subscription) {
        // TODO
        console.log(subscription);
    };

    self._handleSubscriptionError = function(error) {
        // TODO
        console.log(error);
    };

    self._handleEvent = function(event) {
        var items = $(event).find('items').children().toArray();
        items.forEach(function(item, idx, _) {
            var json = $(item).find('json');
            var route = json.attr('route');
            if (!route) {
                return;
            }

            route = route.toLowerCase();
            var dispatchRouteExists = Notifications.xmpp.routes[route] || false;

            if (route && dispatchRouteExists) {
                var content = self._getMessageContent(json);
                Notifications.xmpp.routes[route].dispatch(content);
            }
        });
        return true;
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
        self.config.compression[compression].decompress(data);
    };
}
