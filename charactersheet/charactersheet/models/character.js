'use strict';

/**
 * Character Model
 * @author Brian Schrader
 *
 * A model of a character and their associated key. This model sits at the
 * top of the relational model of data for Adventurer's Codex and also provides
 * a few convenience methods for fetching common data regarding a character.
 */
function Character() {
    var self = this;
    self.ps = PersistenceService.register(Character, self);

    self.key = ko.observable(null);
    self.playerType = ko.observable(PlayerTypes.characterPlayerType);
    self.isDefault = ko.observable(false);

    self.importValues = function(values) {
        self.key(values.key);
        self.isDefault(values.isDefault);

        var keys = Object.keys(PlayerTypes);
        for (var i=0;i<keys.length;i++) {
            if (PlayerTypes[keys[i]].key === values.playerType.key) {
                self.playerType(PlayerTypes[keys[i]]);
            }
        }
    };

    self.exportValues = function() {
        return {
            key: self.key(),
            isDefault: self.isDefault(),
            playerType: self.playerType()
        };
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    /**
     * A summary of the given character. Looks to an active Profile
     * for the data.
     * @returns summary {string} describes the character.
     */
    self.playerSummary = ko.pureComputed(function() {
        var summ = '';
        try {
            summ = Profile.findBy(self.key())[0].characterSummary();
        } catch(err) { /*Ignore*/ }
        return summ;
    });

    /**
     * The author of the given character. Looks to an active Profile
     * for the data.
     * @returns summary {string} an author for the character.
     */
    self.playerAuthor = ko.pureComputed(function() {
        var summ = '';
        try {
            summ = Profile.findBy(self.key())[0].playerName();
        } catch(err) { /*Ignore*/ }
        return summ;
    });

    /**
     * The title of the given character. Looks to an active Profile
     * for the data.
     * @returns summary {string} a title for the character.
     */
    self.playerTitle = ko.pureComputed(function() {
        var summ = '';
        try {
            summ = Profile.findBy(self.key())[0].characterName();
        } catch(err) { /*Ignore*/ }
        return summ;
    });

    self.saveToFile = function() {
        var string = JSON.stringify(Character.exportCharacter(self.key()),
            null, 2); //Pretty print
        var filename = self.playerTitle();
        var blob = new Blob([string], {type: 'application/json'});
        saveAs(blob, filename);
    };
}

Character.findAll = function() {
    return PersistenceService.findAll(Character);
};

Character.findBy = function(characterId) {
    return Character.findAll().filter(function(e, i, _) {
        if (e.key() === characterId) return e;
    });
};

Character.exportCharacter = function(characterId) {
    var data = {};
    PersistenceService.listAll().forEach(function(e1, i1, _1) {
        var items = PersistenceService.findAll(window[e1]).filter(function(e2, i2, _2) {
            var res = false;
            try {
                res = e2.characterId() === characterId;
            } catch(err) {
                try {
                    res = e2.key() === characterId;
                } catch(err) { /*Ignore*/ }
            }
            return res;
        });
        data[e1] = items.map(function(e, i, _) {
            return e.exportValues();
        });
    });
    return data;
};

Character.importCharacter = function(data) {
    var character = null;
    var tableNames = Object.keys(data);
    var characterId = uuid.v4();
    tableNames.forEach(function(e, i, _) {
        var model = window[e];
        data[e].forEach(function(e1, i1, _1) {
            var inst = new model();
            e1 = Character._changeIdForData(characterId, e1);
            inst.importValues(e1);

            PersistenceService.save(model, inst);

            if (e.toLowerCase() === 'character') {
                character = inst;
            }
        });
    });
    return character;
};

/**
 * Given a json serialized model, attempt to change the character id value.
 * @param characterId {string} The new Id for the data.
 * @param data {object} The data containing an id to change.
 * @returns the same data with a new id.
 */
Character._changeIdForData = function(characterId, data) {
    if (Object.keys(data).indexOf('characterId') > -1) {
        data['characterId'] = characterId;
    } else if (Object.keys(data).indexOf('key') > -1) {
        data['key'] = characterId;
    }
    return data;
};
