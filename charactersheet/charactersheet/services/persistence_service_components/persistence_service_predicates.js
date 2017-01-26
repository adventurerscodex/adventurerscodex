'use strict';

/**
 * A convenience class for constructing multi-property queries for
 * the persistence service.
 * 
 * @field key  name of property that will be compared
 * @field value  desired value to be compared against
 */
function KeyValuePredicate(key, value) {
    var self = this;
    
    self.key = key;
    self.value = value;

    self.matches = function(element){
        return element[self.key] === self.value;
    };
}