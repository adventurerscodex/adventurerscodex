'use strict';

/**
 * A convenience class for constructing pairs of percentages that will be processed later.
 *
 * @field value  percentage that represents a particular value
 * @field weight  percentage that determines how valuable the given value is
 *
 * Sample object:
 * StatusWeightPair(89, 30)
 */
function StatusWeightPair(value, weight) {
    var self = this;

    self.value = value;
    self.weight = weight;
}