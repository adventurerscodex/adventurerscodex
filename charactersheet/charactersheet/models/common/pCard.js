'use strict';

/**
# pCard Specification

*A pCard is a structure used to summarize a player's information similar
to how a vCard does for chat systems.*

All fields on a pCard contain both attributes and values that are useful
for different purposes. All entries are in the following format:

    //pCard
    {
     entries: [
        {
            id: a unique id.
            name: a name for the given entry type.
            attr: any meta-data attributes for the item.
            value: the value of the given entry.
        },
        // ...
     ]
    }

## Valid Fields

*Below is a list of all of the valid field names in a pCard and what they should
contain as their attributes and values.*


### Global Fields

__playerName__

The player's chosen name. This is not the character/campaign's name.

`value` should contain the value of the name.

__playerType__

This explains the type of player the card represents.

`value` should contain `dm` or `character`.

__name__

This entry contains the name of the player's character or campaign. Often times
this will be the display name of the player in UI.

`value` should contain the player's character or campagin name.

__imageUrl__

This entry contains the profile image for a given character or campaign.

`value` should contain a public URL to the player's chosen image.


### Character Specific Fields

__statusDescription__

A status description is a human readable sentence that described the character's
current state of being.

`value` should be the sentence describing the character.

__weapon__

An entry for a weapon.

`value` should contain the weapon's data as a JSON object.

__item__

An entry for a item.

`value` should contain the item's data as a JSON object.

__magicItem__

An entry for a magic item.

`value` should contain the magic item's data as a JSON object.

__armor__

An entry for a weapon.

`value` should contain the weapon's data as a JSON object.

// TODO: Add the rest of the player and the DM fields.
*/


/**
 * A pCard [player Card] (similar to a vCard) is a JSON representation of a character/dm
 * in adventurer's codex. This is used as a summary of the given character/dm's
 * current state.
 *
 * cCards contain information about the player type and their details.
 * See the individual fields for more information.
 */
function pCard() {
    var self = this;

    self.entries = [];

    /* Accessor Methods */

    /**
     * Returns the values of any fields that have the given name.
     * If name is a entry ID then return just the 1 entry's value.
     */
    self.get = function(name) {
        var attrs = [];
        for (var i=0; i<self.entries.length; i++) {
            if (self.entries[i].name === name) {
                attrs.push(self.entries[i].value);
            } else if (self.entries[i].id && self.entries[i].id === name) {
                return self.entries[i].value;
            }
        }
        return attrs;
    };

    /**
     * Returns the attributes of any fields that have the given name.
     * If name is a entry ID then return just the 1 entry's attributes.
     */
    self.getAttributes = function(name) {
        var attrs = [];
        for (var i=0; i<self.entries.length; i++) {
            if (self.entries[i].name === name) {
                attrs.push(self.entries[i].attr);
            } else if (self.entries[i].id && self.entries[i].id === name) {
                return self.entries[i].attr;
            }
        }
        return attrs;
    };

    /**
     * Adds an entry if none exists or updates the existing one if id matches
     * an existing entry.
     */
    self.set = function(id, name, attr, value) {
        for (var i=0; i<self.entries.length; i++) {
            if (self.entries[i].id === id) {
                self.entries[i] = { id: id, 'name': name, 'attr': attr, 'value': value };
                return;
            }
        }
        // No entry existed.
        self.entries.push({ id: id, 'name': name, 'attr': attr, 'value': value });
    };

    /**
     * Remove the item with the given id.
     */
    self.remove = function(id) {
        for (var i=0; i<self.entries.length; i++) {
            if (self.entries[i].id === id) {
                delete self.entries[i];
                return;
            }
        }
    };

    /**
     * Remove all entries named `name`.
     */
    self.removeAllNamed = function(name) {
        for (var i=0; i<self.entries.length; i++) {
            if (self.entries[i].name === name) {
                delete self.entries[i];
            }
        }
    };

    /* Serialization Methods */

    self.toJSON = function() {
        return JSON.stringify(self.entries);
    };
}


pCard.fromJSON = function(json) {
    var card = new pCard();
    card.entries = JSON.parse(json);
    return card;
};
