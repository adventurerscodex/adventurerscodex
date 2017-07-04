'use strict';

/**
 * A set of general utilities that provide common functionality to view models.
 */
var ViewModelUtilities = {

    /**
     * Given an view model containing other view models,
     * call the function with the provided attribute name on all sub view
     * models containing the phrase "viewModel"
     * @param {object ViewModel} A view model containing other view models.
     */
    callOnSubViewModels : function(vm, property) {
        var keys = Object.keys(vm);
        for (var i in keys) {
            if (keys[i].indexOf('ViewModel') > -1) {
                try {
                    vm[keys[i]]()[property]();
                } catch(err) {
                    throw 'Module ' + keys[i] + ' failed to ' + property + '.\n' + err;
                }
            }
        }
    },

    /**
     * Given an view model containing other view models,
     * initialize all sub view models containing the phrase "viewModel"
     * @param {object ViewModel} A view model containing other view models.
     */
    initSubViewModels : function(vm) {
        ViewModelUtilities.callOnSubViewModels(vm, 'init');
    },

    /**
     * Given an view model containing other view models,
     * load all sub view models containing the phrase "viewModel"
     * @param {object ViewModel} A view model containing other view models.
     */
    loadSubViewModels : function(vm) {
        ViewModelUtilities.callOnSubViewModels(vm, 'load');
    },

    /**
     * Given an view model containing other view models,
     * unload all sub view models containing the phrase "viewModel"
     * @param {object ViewModel} A view model containing other view models.
     */
    unloadSubViewModels : function(vm) {
        ViewModelUtilities.callOnSubViewModels(vm, 'unload');
    },

    /**
     * Given an view model containing other view models,
     * clear all sub view models containing the phrase "viewModel"
     * @param {object ViewModel} A view model containing other view models.
     */
    clearSubViewModels : function(vm) {
        ViewModelUtilities.callOnSubViewModels(vm, 'clear');
    }
};
