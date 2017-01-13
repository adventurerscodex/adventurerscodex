'use strict';
/*eslint no-console:0*/

//=========================== PersistenceService ==============================

var PersistenceService = {
    customImport: true,
    logErrors: false,
    enableCompression: false,
    master: '__master__',
    version: '__version__',
    storage: localStorage
};

/**
 * Given a table name, return all of the stored data objects in the table.
 *
 * Parameters
 * ----------
 *
 * key: The string name of the table. This usually is the name of the model.
 *
 * Returns
 * -------
 *
 * A list of raw data objects from the table.
 *
 * Note
 * ----
 *
 * The objects returned by this method are raw objects containing an `id` and
 * a data property. The raw `data` property contains the record's data.
 *
 * Usage
 * -----
 * ```javascript
 * function Person() {...}
 *
 * var people = PersistenceService.findAllObjs('Person');```
 */
PersistenceService.findAllObjs = function(key) {
    return PersistenceService._findAllObjs(key);
};

/**
 * Given a model class, return all of the stored instances of that class.
 *
 * Parameters
 * ----------
 *
 * model: The prototype for the type of model that is being searched for.
 *
 * Returns
 * -------
 *
 * A list of objects of the desired type.
 *
 * Usage
 * -----
 * ```javascript
 * function Person() {...}
 *
 * var people = PersistenceService.findAll(Person);```
 */
PersistenceService.findAll = function(model) {
    return PersistenceService._findAll(model);
};



/**
 * Given a model class, return all of the stored instances that match a given
 * filter function.
 *
 * Notes
 * -----
 *
 * The element values passed to the provided filter function are unmapped, raw
 * Javascript data objects.
 *
 * Parameters
 * ----------
 *
 * model: The prototype for the type of model that is being searched for.
 * filterFn: A function, taking an element and its index that returns true if
 * the element should be included in the result.
 *
 * Returns
 * -------
 *
 * A list of objects of the desired type.
 *
 * Usage
 * -----
 * ```javascript
 * var skills = PersistenceService.findFiltered(Skill, function(skill, idx) {
 *   return skill.characterId == characterId;
 * }); ```
 */
PersistenceService.findFiltered = function(model, filterFn) {
    return PersistenceService._findFiltered(model, filterFn);
};


/**
 * Given a model class, return all of the stored instances that match a given
 * filter criteria.
 *
 * Parameters
 * ----------
 *
 * model: The prototype for the type of model that is being searched for.
 * property: A static property of the data object to compare with the given value.
 * value: A value which matches the desired object's property value.
 *
 * Returns
 * -------
 *
 * A list of objects of the desired type, which match the criteria.
 *
 * Usage
 * -----
 * ```javascript
 * var skills = PersistenceService.findBy(Skill, 'characterId', '1234');
 * ```
 */
PersistenceService.findBy = function(model, property, value) {
    return PersistenceService._findFiltered(model, function(element, idx) {
        return element[property] === value;
    });
};

/**
 * Given a model class, return the first instance of the stored mapped models that
 * match a given filter criteria.
 *
 * Parameters
 * ----------
 *
 * model: The prototype for the type of model that is being searched for.
 * property: A static property of the data object to compare with the given value.
 * value: A value which matches the desired object's property value.
 *
 * Returns
 * -------
 *
 * The first object to match the criteria.
 *
 * Usage
 * -----
 * ```javascript
 * var skills = PersistenceService.findFirstBy(Skill, 'characterId', '1234');
 * ```
 */
PersistenceService.findFirstBy = function(model, property, value) {
    return PersistenceService._findFiltered(model, function(element, idx) {
        return element[property] === value;
    })[0];
};


/**
 * Given a model class and an instance of that class, save the instance.
 *
 * Parameters
 * ----------
 *
 * inst: The object you would like to persist.
 * model: The prototype function that created the inst variable.
 *
 * Usage
 * -----
 * ```javascript
 * function Person() {...}
 *
 * PersistenceService.save(Person, new Person());```
 */
PersistenceService.save = function(model, inst) {
    PersistenceService._save(model.name, inst);
};

/**
 * Persist a given database object.
 *
 * Parameters
 * ----------
 *
 * key:
 * id:
 * object:
 *
 * Usage
 * -----
 * ```javascript
 * function Person() {...}
 *
 * PersistenceService.save(Person, new Person());```
 */
PersistenceService.saveObj = function(key, id, object) {
    PersistenceService._saveObj(key, id, object);
};

/**
 * Given a model class and an id, delete the instance with the given id.
 *
 * Parameters
 * ----------
 *
 * model: The prototype function for a given object type.
 * id: The index of the variable to be deleted. This value can be found in
 *     its the __id property.
 *
 * Usage
 * -----
 * ```javascript
 * function Person() {...}
 *
 * PersistenceService.delete(Person, 10);
 *
 * // or
 *
 * var bob = new Person();
 * PersistenceService.delete(Person, bob.__id);```
 */
PersistenceService.delete = function(model, id) {
    PersistenceService._delete(model.name, id);
};

PersistenceService.drop = function(table) {
    PersistenceService._findAllObjs(table).forEach(function(e, i, _) {
        PersistenceService._delete(table, e.id);
    });
};

/**
 * List all of the existing tables.
 */
PersistenceService.listAll = function() {
    return PersistenceService._listAll();
};

PersistenceService.dropAll = function() {
    PersistenceService.listAll().forEach(function(table, i1, _1) {
        PersistenceService.drop(table);
    });
};


/**
 * Register a given model as persisting. Typical usage of this class
 * will mean that this should be the only method needed from this class.
 * Once registered, use the PersistenceServiceToken API for shortcut methods.
 *
 * Parameters
 * ----------
 *
 * model: The prototype function that created the inst variable.
 * inst: The object you would like to persist.
 *
 * Returns
 * -------
 *
 * A configured PersistenceServiceToken instance.
 *
 * Usage
 * -----
 * ```javascript
 * function Person() {
 *         var self = this;
 *         self.ps = PersistenceService.register(Person, self);
 * }```
 */
PersistenceService.register = function(model, inst) {
    return new PersistenceServiceToken(model, inst);
};


/**
 * Migrate will go through the list of given migrations and
 * determine if migrations should be applied based on the app
 * version number.
 *
 * Parameters
 * ----------
 *
 * migrations: list of migraton objects
 * version: current app version number
 *
 * Usage
 * -----
 *
 *
 *
 */
PersistenceService.migrate = function(migrations, version) {
    var databaseVersion = PersistenceService.getVersion();

    if(version !== databaseVersion) {
        var migrationsToRun = migrations.filter(function(e, i, _){
            return PersistenceService._shouldApplyMigration(version, databaseVersion, e);
        });

        migrationsToRun.forEach(function(e, i, _) {
            PersistenceService._applyMigration(e);
        });

        PersistenceService._setVersion(version);
    }
};


/**
 * Returns the current database version.
 */
PersistenceService.getVersion = function() {
    return PersistenceService.storage[PersistenceService.version];
};

/**
 * Perform a series of operations against a temporary data store. Useful for
 * running migrations or copy operations.
 * All errors thrown in the callback block are silenced.
 *
 * WARNING: This method is not threadsafe. All persistence operations
 * are against the current global data store.
 */
PersistenceService.withTemporaryDataStore = function(store, callback) {
    var _storage = PersistenceService.storage;
    PersistenceService.storage = store;
    try {
        callback();
    } catch(err) { /* Ignore */ }
    PersistenceService.storage = _storage;
};


//======================= PersistenceServiceToken =============================

/**
 * A shortcut object for managing a single model object, once it has been registered.
 */
function PersistenceServiceToken(model, inst) {
    var self = this;

    self.model = model;
    self.inst = inst;

   /**
    * Return all of the stored instances of the configured class.
    *
    * Returns
    * -------
    *
    * A list of objects of the desired type.
    *
    * Usage
    * -----
    * ```javascript
    * function Person() {
    *         var self = this;
    *         self.ps = PersistenceService.register(Person, self);
    *
    *         self.findAll = function() {
    *             var people = self.ps.findAll(Person);
    *         };
    * }```
    */
    self.findAll = function() {
        return PersistenceService.findAll(self.model);
    };

    /**
     * Save the instance.
     *
     * Usage
     * -----
     * ```javascript
     * function Person() {
     *         var self = this;
     *         self.ps = PersistenceService.register(Person, self);
     *
     *         self.save = function() {
     *             var people = self.ps.save();
     *         }
     * }```
     */
    self.save = function() {
        PersistenceService.save(self.model, self.inst);
    };

    /**
     * Delete the instance.
     *
     * Usage
     * -----
     * ```javascript
     * function Person() {
     *         var self = this;
     *         self.ps = PersistenceService.register(Person, self);
     *
     *         self.delete = function() {
     *             var people = self.ps.delete();
     *         }
     * }```
     */
    self.delete = function() {
        PersistenceService.delete(self.model, self.inst.__id);
    };
}

//=============================================================================
//============================= Private Methods ===============================
//=============================================================================

PersistenceService._setVersion = function(appVersion) {
    return PersistenceService.storage[PersistenceService.version] = appVersion;
};

PersistenceService._findAllObjs = function(key) {
    var res = [];
    var all = [];
    try {
        all = JSON.parse(PersistenceService.storage[key]);
    } catch(err) { /*Ignore*/ }

    for (var i in all) {
        res.push({ id: i, data: all[i] });
    }
    return res;
};


PersistenceService._findAll = function(model) {
    var objs = PersistenceService._findAllObjs(model.name);
    return PersistenceService._mapModels(objs, model);
};


PersistenceService._findFiltered = function(model, filterFn) {
    var objs = PersistenceService._findAllObjs(model.name);
    var filtered = objs.filter(function (element, idx, _) {
        return filterFn(element.data, idx);
    });
    return PersistenceService._mapModels(filtered, model);
};


PersistenceService._mapModels = function(objs, model) {
    var models = [];
    if (PersistenceService.customImport) {
        for (var i=0; i<objs.length; i++) {
            var o = new model();
            try {
                o.importValues(objs[i].data);
                o.__id = objs[i].id;
            } catch(err) {
                var msg = 'Import of ' + model.name + ' at index ' + i + ' failed.';
                if (PersistenceService.logErrors) {
                    console.log(msg);
                } else {
                    throw msg;
                }
            }
            models.push(o);
        }
    } else {
        models = objs;
    }
    return models;
};


PersistenceService._save = function(key, inst) {
    //Export the instance's data.
    var data;
    if (PersistenceService.customImport) {
        try {
            data = inst.exportValues();
        } catch(err) {
            var msg = 'Export of ' + key + ' failed.';
            if (PersistenceService.logErrors) {
                console.log(msg);
            } else {
                throw msg;
            }
        }
    } else {
        data = JSON.stringify(inst);
    }
    //Save the data.
    var table;
    try {
        table = JSON.parse(PersistenceService.storage[key]);
    } catch(err) {
        table = {};
    }
    //Make an id if one doesn't exist.
    var id = inst.__id;
    if (id === undefined || id === null) {
        var indecies = Object.keys(table);
        indecies.sort(function(a,b){return parseInt(b)-parseInt(a);});

        id = indecies[0] ? parseInt(indecies[0]) + 1 : 0;
        inst.__id = id;
    }

    PersistenceService._saveObj(key, id, data);
};

PersistenceService._saveObj = function(key, id, object) {
    //Save the data.
    var table;
    try {
        table = JSON.parse(PersistenceService.storage[key]);
    } catch(err) {
        table = {};
    }
    table[id] = object;
    try {
        PersistenceService.storage[key] = JSON.stringify(table);
    } catch(err) {
        var errmsg = 'Storage quota exceeded.';
        if (!PersistenceService.enableCompression) {
            errmsg += ' Try enabling compression for more storage.';
        }

        if (PersistenceService.logErrors) {
            console.log(errmsg);
        } else {
            throw errmsg;
        }
    }

    //Update the master table.
    var tables;
    try {
        tables = JSON.parse(PersistenceService.storage[PersistenceService.master]);
    } catch(err) {
        tables = [];
    }
    if (tables.indexOf(key) === -1) {
        tables.push(key);
        PersistenceService.storage[PersistenceService.master] = JSON.stringify(tables);
    }
};

PersistenceService._delete = function(key, id) {
    var table = JSON.parse(PersistenceService.storage[key]);
    if (Object.keys(table).indexOf(String(id)) > -1) {
        delete table[id];
    } else {
        var msg = 'No such element at index: ' + id;
        if (PersistenceService.logErrors) {
            console.log(msg);
        } else {
            throw msg;
        }
    }
    PersistenceService.storage[key] = JSON.stringify(table);
};

PersistenceService._listAll = function() {
    return JSON.parse(PersistenceService.storage[PersistenceService.master]);
};

// Migration Methods

PersistenceService._applyMigration = function(migration) {
    //Clone local storage.
    var oldStorage = {};
    PersistenceService._copyObjectUsingKeys(localStorage, oldStorage);

    try {
        migration.migration();
    } catch(err) {
        // Rollback database in case of error with migration
        PersistenceService._copyObjectUsingKeys(oldStorage, localStorage);
        var msg = 'Migration failed on ' + migration.name;
        console.log(msg);
        throw msg;
    }
};

PersistenceService._shouldApplyMigration = function(appVersion, dbVersion, migration) {
    //LEGACY: The db has no version number.
    if (!dbVersion) {
        dbVersion = '0.0.0';
    }

    var appAndDBVerionsDiffer = PersistenceService._compareVersions(appVersion, dbVersion);
    var migrationVersionHigherThanDB = PersistenceService._compareVersions(migration.version, dbVersion);
    var migrationVersionLowerOrEqualApp = !PersistenceService._compareVersions(migration.version, appVersion);

    return appAndDBVerionsDiffer && migrationVersionHigherThanDB && migrationVersionLowerOrEqualApp;
};

PersistenceService._compareVersions = function(version1, version2) {
    //Parse the versions.
    var version1Numbers = version1.split('.').map(function(e, i, _) {
        return parseInt(e);
    });
    var version2Numbers = version2.split('.').map(function(e, i, _) {
        return parseInt(e);
    });

    //If any part of version 1 is higher than any part of version 2, return true.
    for (var i in version1Numbers) {
        if (version2Numbers[i] === undefined) {
            return true;
        }

        if (version1Numbers[i] > version2Numbers[i]) {
            return true;
        }
    }
    return false;
};

PersistenceService._copyObjectUsingKeys = function(objA, objB) {
    Object.keys(objA).forEach(function(key, i, _) {
        objB[key] = objA[key];
    });
};
