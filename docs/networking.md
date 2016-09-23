# Networking Architecture

This document describes the current and future plans for the Networking
Infrastructure of Adventurer's Codex.


## Overview

The architecture has 4 parts, each have their own section devoted to explaining
their purpose in depth.

- `ConnectionService`: Manages the WebSocket connection, sends raw messages and posts
  notifications when messages/events are recieved. 

- `SerializerService`: Handles the conversion from `Message` objects to raw IRC
  text messages.

- `RoutingService`: Handles routing messages to their appropriate destination via
  notifications.

- Consumer Services: These are custom services that handle forming, sending,
  and storing messages, as well as alerting their partner ViewModels about any
updates or changes.

```
Remote         | Client
---------------|-----------------------------------
{ Server } <- ws:// -> [Connection] <--> [Serializer] <--> [Router]
               |                                              |
               |                                              v
               |                                      [Consumer Services]
```

In this architecture, each component is limited in scope, and communicates
with, at most, two other clients.

All services in this architecture communicate via the central Notifications
message bus. This allows other services to plug into any step in the pipeline
if needed to provide additional functionality. While this is techincally
possible, most consumer services will only need to interact with the routing
service to perform their function.


## In Detail

In this section we will dive into further detail regarding what each component
of the architecture will do, and its status.


### The Connection Service 

This service is at the base of the messaging architecture and handles
sending/recieving the raw IRC messages over a WebSocket connection. It deals
with error handling and connection timeouts as well as reestablishing the
connection when it fails. 

This service pays no attention to the content of the messages transported over
the connection, and is only concerned with the health and status of the
connection itself.


#### Incoming

Once a new message is recieved, this service dispatches a notification with
the message's content. The notifications sent by this service are extremly high
volume and it is not recommended that services, other than the serializer
service consume the pipeline. 


#### Outgoing

The connection service is the only service capable of sending messages over the
WebSocket connection, and it only accepts raw IRC formatted messages. Services
looking to send messages should look into the convinience methods in other
services for more information on how to send conventional messages.
 

### The Serializer Service

This service intercepts messages dispatched by the Connection Service, if
incoming, or from the routing service, if outgoing, and converts the message
into the form required for it to continue it's journey.


#### Incoming

Once a raw IRC message is recieved by the Serializer Service, it is converted
from it's raw, text-based form into a type of message object. This type is
dependent on the various headers and information sent to it by either the
connection service or the upstream routing service.


#### Outgoing 

Messages sent from the routing service will be serialized according to it's
source headers, and dispatched to the Connection Service to be sent.


### The Routing Service

This service is the main interface to all other consumer/publisher services in
the system. Given a message and a destination, it dispatches the message to all
subscribers. This service listens for new messages to route and performs the
routing.

The router performs the first level of filtering of messages. For example, all
messages received over a connection are sent to the router, but only a subset
or messages relevant to the current subscribed services are emitted.


#### Incoming, and Outgoing

This service performs the same logic regardless of incoming or outgoing, with
the only difference being the destination. Incoming messages, sent from the
serializer are routed to their appropriate consumer service where as new
outgoing messages are routed to the serializer to be sent on to the Connection
Service. 




