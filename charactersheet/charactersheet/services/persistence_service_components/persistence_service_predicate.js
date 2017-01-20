'use strict';

/**
 * A convenience class for constructing multi-property queries for
 * the persistence service.
 * 
 * @field key  name of property that will be compared
 * @field value  desired value to be compared against
 */
function PersistenceServicePredicate() {
    var self = this;
    
    self.key = '';
    self.value = '';
}

PersistenceServicePredicate.keyValuePredicate = function(key, value) {
    var predicate = new PersistenceServicePredicate();
    predicate.key = key;
    predicate.value = value;
    return predicate;
};
