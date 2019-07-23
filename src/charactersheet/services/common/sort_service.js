/**
 * A utility class that provides helpers for sorting, filtering, and
 * determining the various properties of sortable tables.
 */
import { reverse, sortBy } from 'lodash';
export var SortService = {

    /**
     * Given an array of data, a sort to apply, and an optional
     * filter return a subset of the data that applies to the given criteria.
     * For more information regarding sorts/filters and what format they
     * should take see: SortService.defaultSort, SortService.defaultFilter
     * @param data: an iterable piece of data to be sorted and filtered.
     * @param sort: a sort to apply.
     * @param filter: a filter to apply.
     */
    sortAndFilter: function(data, sort, filter) {
        if (filter) {
            //TODO
        }
        var asc = sort.direction === 'asc' ? true : false;
        const sorted = sortBy(data, (entity) => {return entity[sort.field]();});
        if (sort.direction !== 'asc') {
            reverse(sorted);
        }
        return sorted;
    },

    /**
     * Given a column name and sort, determines whether a column should
     * have an up/down/no arrow for sorting. Returns the arrow class for the
     * appropriate sort direction.
     */
    sortArrow: function(columnName, sort) {
        var arrow = '';
        if (columnName === sort.field) {
            if (sort.direction === 'asc') {
                arrow = 'fa fa-arrow-up fa-color';
            } else {
                arrow = 'fa fa-arrow-down fa-color';
            }
        }
        return arrow;
    },

    /**
     * Given the current table sort, a column name, and a list
     * of all possible sorts, return the sort for the given column.
     */
    sortForName: function(sort, columnName, allSorts) {
        var newSort;
        if (sort.field === columnName && sort.direction === 'asc') {
            newSort = allSorts[columnName+' desc'];
        } else {
            newSort = allSorts[columnName+' asc'];
        }
        return newSort;
    }
};
