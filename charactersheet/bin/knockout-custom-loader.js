import ko from 'knockout'


/**
 * A custom component loader that binds a view model's `load` method (if exists)
 * to the component's instantiation.
 *
 * author: Brian Schrader
 */
const LifecycleComponentLoader = {
    'loadViewModel': function(componentName, viewModelConfig, callback) {
        resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
    }
};


function resolveViewModel(errorCallback, viewModelConfig, callback) {
    if (typeof viewModelConfig === 'function') {
        callback(function (params /*, componentInfo */) {
            var viewModel = new viewModelConfig(params)
            if ('load' in viewModel) {
                viewModel.load();

            }
            return viewModel;
        });
    } else if ('viewModel' in viewModelConfig) {
        resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
    }

    // Hand the work off to another loader.
    return null;
}


function makeErrorCallback(componentName) {
    return function (message) {
        throw new Error('Component \'' + componentName + '\': ' + message);
    };
}

ko.components.loaders.unshift(LifecycleComponentLoader);
