import ko from 'knockout';

/**
 * form-submit-actions
 *
 * A component that provides the action buttons for a form.
 * The Form Submit Action Compoent provides the default way to submit or reset
 * a form. Submit button will activate the submit of a containing form. As many
 * forms include information that requires a disclaimer, that disclaimer text
 * is included here, with an observable for displaying it.
 * The submit action component will only optionally display the delete button
 * if the form manages a deletable item (e.g. the item is not new). It will
 * not display this button if it does not have an action.
 *
 * @param showDisclaimer {observable} Whether or not to display the disclaimer.
 * @param adForm {observable} Whether or not to display the disclaimer.
 * @param delete {function} The method to delete the item under edit.
 * @param reset {function} The method to reset the form to its previous state.

 *
 * Usage:
 * <card-submit-actions params="{
 *       addForm: createNew,
 *       showDisclaimer: isSRD,
 *       delete: deleteFunction,
 *       reset: resetFunction }
 * "></card-submit-actions>
 */
export class FormSubmitActionComponent {
    constructor(params) {
        this.addForm = params.addForm;
        this.showDisclaimer = params.showDisclaimer;
        this.reset = params.reset;
        this.delete = params.delete;
    }

    clickReset = () => {
        this.reset();
    }

    clickDelete = () => {
        this.delete();
    }

    showDelete = () => {
        return !ko.unwrapObservable(this.addForm) && !!this.delete;
    }
}

ko.components.register('form-submit-actions', {
    viewModel: FormSubmitActionComponent,
    template: '\
      <p class="text-muted text-left" style="padding: 10px;" data-bind="visible: $component.showDisclaimer">\
        <sm><i>This data is distributed under the\
            <a href="http://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf" target="_blank">OGL</a>\
            <br />Open Game License v 1.0a Copyright 2000, Wizards of the Coast, LLC.\
            </i>\
        <sm>\
      </p>\
      <div class="col-xs-12">\
        <div data-bind="if: $component.showDelete()" class="pull-left">\
          <button class="btn btn-sm btn-danger"\
                  type="button"\
                  data-bind="click: $component.clickDelete">Delete</button>\
        </div>\
        <div class="pull-right">\
          <button class="btn btn-sm btn-default"\
                  type="reset"\
                  data-bind="click: $component.clickReset">Cancel</button>\
          <!-- ko ifnot: $component.addForm -->\
          <button class="btn btn-sm btn-primary" type="submit">Save</button>\
          <!-- /ko -->\
          <!-- ko if: $component.addForm -->\
          <button type="submit" class="btn btn-primary btn-sm">Add</button>\
          <!-- /ko -->\
        </div>\
      </div>\
      '
});
