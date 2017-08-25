'use strict';

/**
 * Every message sent through the chat will have a type that tells
 * the chat interface and the various chat subsystems how to render
 * and route the given chat message.
 */
export var CHAT_MESSAGE_TYPES = {
    /**
     * Messages of type META detail something about the chat room:
     * Like a subject, or other room message.
     */
    META: 'meta',

    /**
     * Messages of type CHAT are usually plain-text messages sent to/from
     * other members in the party.
     * These messages are usually displayed along with the user's profile
     * picture and their name in the relevant room.
     *
     * NOTE: These messages MUST not have any additional payload.
     */
    CHAT: 'chat',

    /**
     * SYSTEM messages are any type of messages that do not conform to
     * another type. These can include malformed messages, as well as
     * other valid XMPP message types (i.e. <presence> messages).
     *
     * NOTE: These messages regard the connection as a whole,
     * or other presence messages.
     */
    SYSTEM: 'system',

    /**
     * Messages of type READ_ALOUD are used to send read aloud text
     * through the chat system to/from a given user.
     *
     * These data messages can optionally contain a plain-text message that
     * the user should be shown in the chat to indicate that a data object
     * has been received.
     *
     * NOTE: It is recommended to include a plain-text message with these messages.
     */
    READ_ALOUD: 'read-aloud',

    /**
     * Messages of type IMAGE are used to send some form of JSON payload
     * through the chat system to/from a given user.
     *
     * These data messages can optionally contain a plain-text message that
     * the user should be shown in the chat to indicate that a data object
     * has been received.
     *
     * NOTE: It is recommended to include a plain-text message with these messages.
     */
    IMAGE: 'image',

    /**
     * Messages of type FORM are used to present some interactive content
     * to the user and take some action when the message has been interacted
     * with.
     *
     * NOTE: These actions are not yet designed.
     */
    FORM: 'form'
};

