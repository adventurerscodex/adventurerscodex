import ko from 'knockout';

/**
 * This component provides a generic template for controlling and displaying forms in a preview and
 * edit mode.
 *
 * @param {*} params contains observables and other data from the parent viewmodel
 *                   - data: this observable holds the data used to render both the forms
 *                   - save: this is a javascript function used to save the edited data
 *                   - validation: this javascript object conatains the validation constraints to
 *                     be used in the form validation
 */
export class PreviewEditViewModel {

    isEditFormValid = ko.observable(false);
    isEdit = ko.observable(false);

    constructor(params) {
        this.data = params.data;
        this.save = params.save;
        this.validationConstraints = params.validation;
    }

    toggleEditForm = () => {
        this.isEdit(!this.isEdit());
    };

    saveAndToggleForm = async () => {
        await this.save();
        this.toggleEditForm();
    };

    validation = {
        updateHandler: ($element) => {
            this.isEditFormValid($element.valid());
        },
        // Deep copy of properties in object
        ...this.validationConstraints
    };
}

ko.components.register('preview-edit', {
    viewModel: PreviewEditViewModel,
    template: '\
        <!-- ko if: isEdit -->\
        <button type="button"\
                class="btn btn-sm btn-primary pull-right"\
                data-bind="click: saveAndToggleForm, disable: !isEditFormValid()">\
        Save\
        </button>\
        <!-- /ko -->\
        <!-- ko template: { nodes: $componentTemplateNodes, data: data } -->\
        <!-- /ko -->'
});