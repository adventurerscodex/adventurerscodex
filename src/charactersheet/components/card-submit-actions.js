import ko from 'knockout';

/**
 * card-action-button component
 *
 * A component that provides the action icons for the top of a card.
 * The Card Action Buttons provide an additional way to submit or reset
 * a form in addition to form buttons, generally positioned in the same spot as
 * the edit icon for flip cards. Submit button will activate the submit of
 * a containing form.
 *
 * @param reset {function} The method to reset the form to its previous state.
 *
 * Usage:
 * <card-submit-actions params="{
 *       reset: resetFunction
 * }"></card-submit-actions>
 */

export class CardSubmitActionComponent {
    constructor(params) {
        this.reset = params.reset;
    }
    clickReset = () => {
        this.reset();
    }
}

ko.components.register('card-submit-actions', {
    viewModel: CardSubmitActionComponent,
    template: '\
    <div class="btn-group edit-btn" role="group" aria-label="actionButtons">\
      <button class="btn btn-link" data-bind="click: clickReset" type="reset">\
        <span class="fa fa-color fa-times-circle fa-color-hover" aria-hidden="true"></span>\
      </button>\
      <button class="btn btn-link" type="submit" value="submit">\
        <span class="fa fa-color fa-floppy-o fa-color-hover-success" aria-hidden="true"></span>\
      </button>\
    </div>\
    '
});
