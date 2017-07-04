'use strict';

var DataRepository = {
    /**
     * Convenience function to filter data repository by key
     *
     * @param arrayName: name of array to be queried
     * @param key: the key to filter by
     * @param value: value that key should equal
     */
    filterBy: function(arrayName, key, value){
        return DataRepository[arrayName].filter(function(item, idx, _) {
            return item[key] === value;
        });
    }
};
