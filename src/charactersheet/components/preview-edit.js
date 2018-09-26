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
export function PreviewEditViewModel(params) {
    var self = this;

    self.data = params.data;
    self.save = params.save;
    self.validationConstraints = params.validation;
    self.isEditFormValid = ko.observable(false);
    self.isEdit = ko.observable(false);

    self.toggleEditForm = () => {
        self.isEdit(!self.isEdit());
    };

    self.saveAndToggleForm = async () => {
        await self.save();
        self.toggleEditForm();
    };

    self.validation = {
        updateHandler: ($element) => {
            self.isEditFormValid($element.valid());
        },
        // Deep copy of properties in object
        ...self.validationConstraints
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