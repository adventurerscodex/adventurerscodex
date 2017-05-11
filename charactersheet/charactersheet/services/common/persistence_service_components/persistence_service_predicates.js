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


function NotPredicate(predicate) {
    var self = this;

    self.predicate = predicate;

    self.matches = function(element) {
        return !predicate.matches(element);
    };
}


/**
 * Given a list of child predicates return a match if all of the children match.
 */
function AndPredicate(predicates) {
    var self = this;

    self.predicates = predicates;

    self.matches = function(element) {
        return self.predicates.every(function(predicate, idx, _) {
            return predicate.matches(element);
        });
    };
}


/**
 * Given a list of child predicates return a match if any of the children match.
 */
function OrPredicate(predicates) {
    var self = this;

    self.predicates = predicates;

    self.matches = function(element) {
        return self.predicates.some(function(predicate, idx, _) {
            return predicate.matches(element);
        });
    };
}
