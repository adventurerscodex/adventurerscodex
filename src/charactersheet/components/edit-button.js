import ko from 'knockout';

/**
 * edit-button component
 * A useful component for displaying edit or save icons.
 * @param clickAction {function} a function to call on click
 * @param toggleMode {observable} Whether or not the button is toggled
 * Usage:
 */
export function EditButtonComponentViewModel(params) {
    var self = this;
    self.clickAction = params.clickAction;
    self.toggleMode = params.toggleMode;

    self.editModeIcon = ko.pureComputed(() => (
         self.toggleMode() ? 'glyphicon-floppy-save' : 'glyphicon-pencil'
    ));
}

ko.components.register('edit-button', {
    viewModel: EditButtonComponentViewModel,
    template: '\
    <button class="btn btn-link edit-btn" data-bind="click: clickAction">\
        <span class="glyphicon" data-bind="css: editModeIcon" aria-hidden="true">\
        </span>\
      </button>'
});
