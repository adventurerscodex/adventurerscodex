'use strict';
/*eslint no-console:0*/

//=========================== PersistenceService ==============================

var PersistenceService = {
    customImport: true,
    logErrors: false,
    enableCompression: false,
    master: '__master__',
    storage: localStorage
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
    table[id] = data;
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
