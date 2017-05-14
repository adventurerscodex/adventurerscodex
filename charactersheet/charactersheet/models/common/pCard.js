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

__playerJid__

The player's XMPP JID.

`value` should contain the value of the JID.

__playerType__

This explains the type of player the card represents.

`value` should contain `dm` or `character`.

__characterName__

This entry contains the name of the player's character or campaign. Often times
this will be the display name of the player in UI.

`value` should contain the player's character or campagin name.

__imageUrl__

This entry contains the profile image for a given character or campaign.

`value` should contain a public URL to the player's chosen image.

__race__

This entry contains the players character's race.

`value` should contain the players character's race.

__playerClass__

This entry contains the players character's class.

`value` should contain the players character's class.

__level__

This entry contains the players character's level.

`value` should contain the players character's level.

__experience__

This entry contains the players character's experience.

`value` should contain the players character's experience.

__armorClass__

This entry contains the players character's armor class.

`value` should contain the players character's armor class.

__gold__

This entry contains the players character's estimated gold value.

`value` should contain the players character's gold.

__maxHitPoints__

This entry contains the players character's maximum hit points.

`value` should contain the players character's hit points.

__damage__

This entry contains the players character's damage.

`value` should contain the players character's damage.

__tempHitPoints__

This entry contains the players character's temporary hit points.

`value` should contain the players character's temporary hit points.

__hitDiceType__

This entry contains the players character's hit dice type.

`value` should contain the players character's hit dice type.

__hitDice__

This entry contains the players character's available hit dice.
The format for this information is:
    `<unused_hit_dice>/<total_hit_dice>`

`value` should contain the players character's available hit dice over their total hit dice.

__passivePerception__

This entry contains the players character's passive perception, which is fetched from their perception skill.

`value` should contain the players character's passive perception.

__passiveIntelligence__

This entry contains the players character's passive intelligence, which is fetched from their ability scores. 10 + intelligence modifier.

`value` should contain the players character's passive intelligence.

__spellSaveDC__

This entry contains the players character's spell save DC.

`value` should contain the players character's spell save DC.

__healthinessStatus__

This entry contains the players character's healthiness status model.

`value` should contain the players character's deserialized healthiness status model.

__magicStatus__

This entry contains the players character's magic status model.

`value` should contain the players character's deserialized magic status model.

__trackedStatus__

This entry contains the players character's tracked status model.

`value` should contain the players character's deserialized tracked status model.

### Character Specific Fields

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
     * If try to `get` an attribute that has a null/undefined value,
     * an empty array will be returned.
     */
    self.get = function(name) {
        var attrs = [];
        for (var i = 0; i < self.entries.length; i++) {
            if (self.entries[i].name === name && self.entries[i].value != null && self.entries[i].value != undefined) {
                attrs.push(self.entries[i].value);
            } else if (self.entries[i].id && self.entries[i].id === name) {
                return self.entries[i].value;
            }
        }
        return attrs;
    };

    /**
     * Returns the attributes of any fields that have the given name.
     * If name is a entry ID then return just a list containing the 1 entry.
     */
    self.getAttributes = function(name) {
        var attrs = [];
        for (var i=0; i<self.entries.length; i++) {
            if (self.entries[i].name === name) {
                attrs.push(self.entries[i].attr);
            } else if (self.entries[i].id && self.entries[i].id === name) {
                return [self.entries[i].attr];
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

/**
 * Sets an array of objects to the entries field in a pCard.
 *
 * @param entries  array of JS objects
 */
pCard.fromEntries = function(entries) {
    var card = new pCard();
    card.entries = entries;
    return card;
};
