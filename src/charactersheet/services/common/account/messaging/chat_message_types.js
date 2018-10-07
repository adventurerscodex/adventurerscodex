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


export const STATUS_CODES = {
    /**
     * stanza: message or presence
     * context: Entering a room
     * purpose: Inform user that any occupant is allowed to see the user's full JID
     */
    FULL_JID_AVAILABLE: 100,

    /**
     * stanza: message (out of band)
     * context: Affiliation change
     * purpose: Inform user that his or her affiliation changed while not in the room
     */
    AFFILIATION_CHANGED_DURING_ABSENCE: 101,

    /**
     * stanza: message
     * context: Configuration change
     * purpose: Inform occupants that room now shows unavailable members
     */
    ROOM_SHOWS_UNAVAILABLE_MEMBERS: 102,

    /**
     * stanza: message
     * context: Configuration change
     * purpose: Inform occupants that room now does not show unavailable members
     */
    ROOM_HIDES_UNAVAILABLE_MEMBERS: 103,

    /**
     * stanza: message
     * context: Configuration change
     * purpose: Inform occupants that a non-privacy-related room configuration change has occurred
     */
    NON_PRIVACY_CONFIGURATION_CHANGE: 104,

    /**
     * stanza: presence
     * context: Any room presence
     * purpose: Inform user that presence refers to itself
     */
    REFERS_TO_SELF: 110,

    /**
     * stanza: message or initial presence
     * context: Configuration change
     * purpose: Inform occupants that room logging is now enabled
     */
    ROOM_LOGGING_ENABLED: 170,

    /**
     * stanza: message
     * context: Configuration change
     * purpose: Inform occupants that room logging is now disabled
     */
    ROOM_LOGGING_DISABLED: 171,

    /**
     * stanza: message
     * context: Configuration change
     * purpose: Inform occupants that room logging is now anonymous
     */
    ROOM_LOGGING_ANONYMOUS: 172,

    /**
     * stanza: message
     * context: Configuration change
     * purpose: Inform occupants that room logging is now semi-anonymous
     */
    ROOM_LOGGING_SEMI_ANONYMOUS: 173,

    /**
     * stanza: presence
     * context: Entering a room
     * purpose: Inform user that a new room has been created
     */
    ROOM_CREATED: 201,

    /**
     * stanza: presence
     * context: Entering a room, changing nickname, etc.
     * purpose: Inform user that service has assigned or modified occupant's roomnick
     */
    OCCUPANT_ROOMNICK_CHANGED: 210,

    /**
     * stanza: presence
     * context: Removal from room
     * purpose: Inform user that he or she has been banned from the room
     */
    BANNED: 301,

    /**
     * stanza: presence
     * context: Exiting a room
     * purpose: Inform all occupants of new room nickname
     */
    ROOM_NICK_CHANGED: 303,

    /**
     * stanza: presence
     * context: Removal from room
     * purpose: Inform user that he or she has been kicked from the room
     */
    KICKED: 307,

    /**
     * stanza: presence
     * context: Removal from room
     * purpose: Inform user that he or she is being removed from the room because
     * of an affiliation change
     */
    REMOVED_FOR_AFFILIATION_CHANGE: 321,

    /**
     * stanza: presence
     * context: Removal from room
     * purpose: Inform user that he or she is being removed from the room
     * because the room has been changed to members-only and the
     * user is not a member
     */
    REMOVED_NOT_A_MEMBER: 322,

    /**
     * stanza: presence
     * context: Removal from room
     * purpose: Inform user that he or she is being removed from the room
     * because the MUC service is being shut down
     */
    MUC_SHUTDOWN: 332,

    /**
     * stanza: presence
     * context: Removal from room
     * purpose: Inform users that a user was removed because of an error reply
     * (for example when an s2s link fails between the MUC and the removed
     * users server).
     */
    MISC_ERROR: 333,
};

