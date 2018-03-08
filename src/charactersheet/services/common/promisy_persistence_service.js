/*eslint no-console:0*/
import schema from 'schema';
import coreapi from 'coreapi';


class PPersistenceService {

    constructor(credentials) {
        this.customImport = true;
        this.logErrors = false;

        this.schema = schema;

        // Initialize the CoreAPI Client
        const auth = new coreapi.auth.TokenAuthentication(credentials);
        this.client = new coreapi.Client({ auth: auth });
    }

    action = (keys, params) => {
        return this.client.action(this.schema, keys, params);
    };

    // TODO: Reimplement features as class methods.

    list = (model, params=[]) => {
        return this.action([...model.__skeys, 'list'], params);
    };

    retrieve = (model, params=[]) => {
        return this.action([...model.__skeys, 'retrieve'], params);
    };

    create = (model, params=[]) => {
        return this.action([...model.__skeys, 'create'], params);
    };

    update = (model, params=[]) => {
        return this.action([...model.__skeys, 'update'], params);
    };

    destroy = (model, params=[]) => {
        return this.action([...model.__skeys, 'destroy'], params);
    };
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
 * var people = PPersistenceService.findAllObjs('Person');```
 */
PPersistenceService.findAllObjs = (key) => {
    return PPersistenceService._findAllObjs(key);
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
 * var people = PPersistenceService.findAll(Person);```
 */
PPersistenceService.findAll = (model) => {
    return PPersistenceService._findAll(model);
};

/** TODO: UPDATE
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
 * var people = PPersistenceService.findAll(Person);```
 */
PPersistenceService.findAllByName = (modelName) => {
    return PPersistenceService._findAllByName(modelName);
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
 * var skills = PPersistenceService.findFiltered(Skill, (skill, idx) => {
 *   return skill.characterId == characterId;
 * }); ```
 */
PPersistenceService.findFiltered = (model, filterFn) => {
    return PPersistenceService._findFiltered(model, filterFn);
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
 * var skills = PPersistenceService.findBy(Skill, 'characterId', '1234');
 * ```
 */
PPersistenceService.findBy = (model, property, value) => {
    return PPersistenceService._findFiltered(model, (element, idx) => {
        return element[property] === value;
    });
};

/**
 * Given a model class, return all of the stored instances that match a given
 * array of filter criteria.
 *
 * Parameters
 * ----------
 *
 * model: The prototype for the type of model that is being searched for.
 * properties: A static array of properties that the data object will be
 * compared against.
 *
 * Returns
 * -------
 *
 * A list of objects of the desired type, which match the list of criteria.
 *
 * Usage
 * -----
 * ```javascript
 *         var status = PPersistenceService.findByPredicates(Status,
 *          [new KeyValuePredicate('characterId', key),
            new KeyValuePredicate('identifier', self.statusIdentifier)]);
 * ```
 */
PPersistenceService.findByPredicates = (model, predicates) => {
    return PPersistenceService._findFiltered(model, (element, idx) => {
        // Ensure that every comparison returns true.
        return predicates.every((predicate, idx, _) => {
            return predicate.matches(element);
        });
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
 * var skills = PPersistenceService.findFirstBy(Skill, 'characterId', '1234');
 * ```
 */
PPersistenceService.findFirstBy = (model, property, value) => {
    return PPersistenceService._findFiltered(model, (element, idx) => {
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
 * PPersistenceService.save(Person, new Person());```
 */
PPersistenceService.save = (model, inst) => {
    PPersistenceService._save(model.__name, inst);
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
 * PPersistenceService.save(Person, new Person());```
 */
PPersistenceService.saveObj = (key, id, object) => {
    PPersistenceService._saveObj(key, id, object);
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
 * PPersistenceService.delete(Person, 10);
 *
 * // or
 *
 * var bob = new Person();
 * PPersistenceService.delete(Person, bob.__id);```
 */
PPersistenceService.delete = (model, id) => {
    PPersistenceService._delete(model.__name, id);
};

PPersistenceService.drop = (table) => {
    PPersistenceService._findAllObjs(table).forEach((e, i, _) => {
        PPersistenceService._delete(table, e.id);
    });
};

/**
 * List all of the existing tables.
 */
PPersistenceService.listAll = function() {
    return PPersistenceService._listAll();
};

PPersistenceService.dropAll = function() {
    PPersistenceService.listAll().forEach(function(table, i1, _1) {
        PPersistenceService.drop(table);
    });
};


/**
 * Register a given model as persisting. Typical usage of this class
 * will mean that this should be the only method needed from this class.
 * Once registered, use the PPersistenceServiceToken API for shortcut methods.
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
 * A configured PPersistenceServiceToken instance.
 *
 * Usage
 * -----
 * ```javascript
 * function Person() {
 *         var self = this;
 *         self.ps = PPersistenceService.register(Person, self);
 * }```
 */
PPersistenceService.register = (model, inst) => {
    return new PPersistenceServiceToken(model, inst);
};


/**
 * Add the given model to the registry. The registry will be used to map model names
 * to the model object.
 *
 * Parameters
 * ----------
 *
 * model: The model to be added to the registry.
 *
 * Returns
 * -------
 *
 * Nothing.
 *
 * Usage
 * -----
 * ```javascript
 * function Person() {...}
 * PPersistenceService.addToRegistry(Person);
 * ```
 */
PPersistenceService.addToRegistry = (model) => {
    PPersistenceService.registry[model.__name] = model;
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
PPersistenceService.migrate = (migrations, version) => {
    var databaseVersion = PPersistenceService.getVersion();

    if(version !== databaseVersion) {
        var migrationsToRun = migrations.filter(function(e, i, _){
            return PPersistenceService._shouldApplyMigration(version, databaseVersion, e);
        });

        migrationsToRun.forEach((e, i, _) => {
            PPersistenceService._applyMigration(e);
        });

        PPersistenceService._setVersion(version);
    }
};


/**
 * Returns the current database version.
 */
PPersistenceService.getVersion = function() {
    return PPersistenceService.storage[PPersistenceService.version];
};

/**
 * Perform a series of operations against a temporary data store. Useful for
 * running migrations or copy operations.
 * All errors thrown in the callback block are silenced.
 *
 * WARNING: This method is not threadsafe. All persistence operations
 * are against the current global data store.
 */
PPersistenceService.withTemporaryDataStore = (store, callback) => {
    var _storage = PPersistenceService.storage;
    PPersistenceService.storage = store;
    try {
        callback();
    } catch(err) { /* Ignore */ }
    PPersistenceService.storage = _storage;
};


//======================= PPersistenceServiceToken =============================

/**
 * A shortcut object for managing a single model object, once it has been registered.
 */
function PPersistenceServiceToken(model, inst) {
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
    *         self.ps = PPersistenceService.register(Person, self);
    *
    *         self.findAll = function() {
    *             var people = self.ps.findAll(Person);
    *         };
    * }```
    */
    self.findAll = function() {
        return PPersistenceService.findAll(self.model);
    };

    /**
     * Save the instance.
     *
     * Usage
     * -----
     * ```javascript
     * function Person() {
     *         var self = this;
     *         self.ps = PPersistenceService.register(Person, self);
     *
     *         self.save = function() {
     *             var people = self.ps.save();
     *         }
     * }```
     */
    self.save = function() {
        PPersistenceService.save(self.model, self.inst);
    };

    /**
     * Delete the instance.
     *
     * Usage
     * -----
     * ```javascript
     * function Person() {
     *         var self = this;
     *         self.ps = PPersistenceService.register(Person, self);
     *
     *         self.delete = function() {
     *             var people = self.ps.delete();
     *         }
     * }```
     */
    self.delete = function() {
        PPersistenceService.delete(self.model, self.inst.__id);
    };
}

//=============================================================================
//============================= Private Methods ===============================
//=============================================================================

PPersistenceService._setVersion = (appVersion) => {
    return PPersistenceService.storage[PPersistenceService.version] = appVersion;
};

PPersistenceService._findAllObjs = (key) => {
    var res = [];
    var all = [];
    try {
        all = JSON.parse(PPersistenceService.storage[key]);
    } catch(err) { /*Ignore*/ }

    for (var i in all) {
        res.push({ id: i, data: all[i] });
    }
    return res;
};


PPersistenceService._findAll = (model) => {
    return PPersistenceService._findAllByName(model.__name);
};


PPersistenceService._findAllByName = (modelName) => {
    var objs = PPersistenceService._findAllObjs(modelName);
    return PPersistenceService._mapModels(objs, PPersistenceService.registry[modelName]);
};


PPersistenceService._findFiltered = (model, filterFn) => {
    var objs = PPersistenceService._findAllObjs(model.__name);
    var filtered = objs.filter(function (element, idx, _) {
        return filterFn(element.data, idx);
    });
    return PPersistenceService._mapModels(filtered, model);
};


PPersistenceService._mapModels = (objs, model) => {
    var models = [];
    if (PPersistenceService.customImport) {
        for (var i=0; i<objs.length; i++) {
            var o = new model();
            try {
                o.importValues(objs[i].data);
                o.__id = objs[i].id;
            } catch(err) {
                var msg = 'Import of ' + model.__name + ' at index ' + i + ' failed.';
                if (PPersistenceService.logErrors) {
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


PPersistenceService._save = (key, inst) => {
    //Export the instance's data.
    var data;
    if (PPersistenceService.customImport) {
        try {
            data = inst.exportValues();
        } catch(err) {
            var msg = 'Export of ' + key + ' failed.';
            if (PPersistenceService.logErrors) {
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
        table = JSON.parse(PPersistenceService.storage[key]);
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

    PPersistenceService._saveObj(key, id, data);
};

PPersistenceService._saveObj = (key, id, object) => {
    //Save the data.
    var table;
    try {
        table = JSON.parse(PPersistenceService.storage[key]);
    } catch(err) {
        table = {};
    }
    table[id] = object;
    try {
        PPersistenceService.storage[key] = JSON.stringify(table);
    } catch(err) {
        var errmsg = 'Storage quota exceeded.';
        if (!PPersistenceService.enableCompression) {
            errmsg += ' Try enabling compression for more storage.';
        }

        if (PPersistenceService.logErrors) {
            console.log(errmsg);
        } else {
            throw errmsg;
        }
    }

    //Update the master table.
    var tables;
    try {
        tables = JSON.parse(PPersistenceService.storage[PPersistenceService.master]);
    } catch(err) {
        tables = [];
    }
    if (tables.indexOf(key) === -1) {
        tables.push(key);
        PPersistenceService.storage[PPersistenceService.master] = JSON.stringify(tables);
    }
};

PPersistenceService._delete = (key, id) => {
    var table = JSON.parse(PPersistenceService.storage[key]);
    if (Object.keys(table).indexOf(String(id)) > -1) {
        delete table[id];
    } else {
        var msg = 'No such element at index: ' + id;
        if (PPersistenceService.logErrors) {
            console.log(msg);
        } else {
            throw msg;
        }
    }
    PPersistenceService.storage[key] = JSON.stringify(table);
};

PPersistenceService._listAll = function() {
    return JSON.parse(PPersistenceService.storage[PPersistenceService.master]);
};

// Migration Methods

PPersistenceService._applyMigration = (migration) => {
    //Clone local storage.
    var oldStorage = {};
    PPersistenceService._copyObjectUsingKeys(localStorage, oldStorage);

    try {
        migration.migration();
    } catch(err) {
        // Rollback database in case of error with migration
        PPersistenceService._copyObjectUsingKeys(oldStorage, localStorage);
        var msg = 'Migration failed on ' + migration.name;
        console.log(msg);
        throw msg;
    }
};

PPersistenceService._shouldApplyMigration = (appVersion, dbVersion, migration) => {
    //LEGACY: The db has no version number.
    if (!dbVersion) {
        dbVersion = '0.0.0';
    }

    var appAndDBVerionsDiffer = PPersistenceService._compareVersions(appVersion, dbVersion);
    var migrationVersionHigherThanDB = PPersistenceService._compareVersions(migration.version, dbVersion);
    var migrationVersionLowerOrEqualApp = !PPersistenceService._compareVersions(migration.version, appVersion);

    return appAndDBVerionsDiffer && migrationVersionHigherThanDB && migrationVersionLowerOrEqualApp;
};

PPersistenceService._compareVersions = function(version1, version2) {
    //Parse the versions.
    var version1Numbers = version1.split('.').map((e, i, _) => {
        return parseInt(e);
    });
    var version2Numbers = version2.split('.').map((e, i, _) => {
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

PPersistenceService._copyObjectUsingKeys = (objA, objB) => {
    Object.keys(objA).forEach((key, i, _) => {
        objB[key] = objA[key];
    });
};


export default PPersistenceService;
