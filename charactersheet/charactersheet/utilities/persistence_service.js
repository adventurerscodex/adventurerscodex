"use strict";

function Constraints() {
    var self = this;
    
    self._constraints = [];
    
    /**
     * Registers that a given field should be unique.
     */
    self.unique = function(value) {
        self._constraints.push(['unique', value])
    };
    
    /**
     * Checks if a given value is under a given constraint.
     */
    self.is = function(key, val) {
        for (var i = 0; i<self._constraints.length; i++) {
            var obj = self._constraints[i];
            if (obj[0] === key && obj[1] === val) {
                return true;
            }
        }
        return false;
    };
};

//=========================== PersistenceService ==============================

var PersistenceService = {
	customImport: true,
	logErrors: false,
	enableCompression: false,
	master: '__master__'
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
	PersistenceService._save(model.name, inst, null);
};

/**
 * Given a model class and an id, delete the instance with the given id.
 *
 * Parameters
 * ----------
 *
 * model: The prototype function for a given object type.
 * id: The index of the variable to be deleted. This value can be found in 
 * 	its the __id property. 
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
		PersistenceService._delete(table, e.id)
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
 * 		var self = this;
 * 		self.ps = PersistenceService.register(Person, self);
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
	self.constraints = new Constraints();
	
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
	* 		var self = this;
	* 		self.ps = PersistenceService.register(Person, self);
	* 		
	* 		self.findAll = function() {
	* 			var people = self.ps.findAll(Person);
	* 		};
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
	 * 		var self = this;
	 * 		self.ps = PersistenceService.register(Person, self);
	 * 		
	 * 		self.save = function() {
	 * 			var people = self.ps.save();
	 * 		}
	 * }```
	 */
	self.save = function() {
		PersistenceService._save(self.model, self.inst, self.constraints);
	};
	
	/**
	 * Delete the instance.
	 *
	 * Usage
	 * -----
	 * ```javascript
	 * function Person() {
	 * 		var self = this;
	 * 		self.ps = PersistenceService.register(Person, self);
	 * 		
	 * 		self.delete = function() {
	 * 			var people = self.ps.delete();
	 * 		}
	 * }```
	 */
	self.delete = function() {
		PersistenceService.delete(self.model, self.inst.__id);
	};
};

//=============================================================================
//============================= Private Methods ===============================
//=============================================================================

PersistenceService._findAllObjs = function(key) {
	var res = [];
	var all = [];
	try {
		all = JSON.parse(localStorage[key]);
	} catch(err) {};
	
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
				var msg = "Import of " + model.name + " at index " + i + " failed.";
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

PersistenceService._save = function(key, inst, constraints) {
	//Export the instance's data.
	var data;
	if (PersistenceService.customImport) {
		try {
			data = inst.exportValues();
		} catch(err) {
			var msg = "Export of " + key + " failed.";
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
		table = JSON.parse(localStorage[key]);
	} catch(err) {
		table = {};
	}
	//Make an id if one doesn't exist.
	//If the item should be unique, then check if it already exists first.
	var id = inst.__id;
	if (id === undefined || id === null) {
	    //Check unique.
	    id = PersistenceService._getUniqueIndexFor(table, data, constraints)
	    if (id === undefined || id === null) {
            var indecies = Object.keys(table);
    	    //Make new index.
            indecies.sort(function(a,b){return parseInt(b)-parseInt(a)});
        
            id = indecies[0] ? parseInt(indecies[0]) + 1 : 0;
            inst.__id = id;
        }
	}
    table[id] = data;	
	try {
		localStorage[key] = JSON.stringify(table);
	} catch(err) {
		var msg = "Storage quota exceeded."
		if (!PersistenceService.enableCompression) {
			msg += " Try enabling compression for more storage."
		}
		
		if (PersistenceService.logErrors) {
			console.log(msg);
		} else {
			throw msg;
		}
	}
	//Update the master table.
	var tables;
	try {
		tables = JSON.parse(localStorage[PersistenceService.master])
	} catch(err) {
		tables = [];
	}
	if (tables.indexOf(key) === -1) {
		tables.push(key);
		localStorage[PersistenceService.master] = JSON.stringify(tables);
	}
};

PersistenceService._delete = function(key, id) {
	var table = JSON.parse(localStorage[key]);
	if (Object.keys(table).indexOf(String(id)) > -1) {	
		delete table[id];
	} else {
		var msg = "No such element at index: " + id;
		if (PersistenceService.logErrors) {
			console.log(msg);
		} else {
			throw msg;
		}
	}
	localStorage[key] = JSON.stringify(table);
};

PersistenceService._listAll = function() {
	return JSON.parse(localStorage[PersistenceService.master]);
}

/**
 * If an item with that unique constraint exists, return it's index else null.
 */
PersistenceService._getUniqueIndexFor = function(table, data, constraints) {
    var tableKeys = Object.keys(table);
    var uniqueKeys = [];
    //Find the unique keys.
    try {
        var firstItem = table[tableKeys[0]];
        var itemKeys = Object.keys(firstItem);
        for (var i = 0; i<itemKeys.length; i++) {
            if (constraints.is('unique', itemKeys[i]) {
                uniqueKeys.push(itemKeys[i]);
            }
        }
    } catch(err) {
        return null;
    }
    
    if (uniqueKeys.length === 0) {
        return null;
    }
    
    //Check if a unique item exists.
    var uniqueVals = [];
    for (var i = 0; i<tableKeys.length; i++) {
        var item = table[tableKeys[i]];
        for (var j = 0; j<uniqueKeys.length; j++) {
            var itemKey = uniqueKeys[j];
            var notInside = uniqueVals.some(function(e, k, _) {
                return e.key !== itemKey || e.val !== item[itemKey]
            });
            if (notInside) {
                uniqueVals.push({ 
                    id: tableKeys[i],
                    val: item[itemKey],
                    key: uniqueKeys[j]
                });
            }
        }
    }
    //See if the data matches.
    var matches = uniqueVals.filter(function(e, i, _) {
        return data[e.key] === e.val;
    });
    if (matches.length > 0) {
        return matches[0].id;
    }
    return null;
};
