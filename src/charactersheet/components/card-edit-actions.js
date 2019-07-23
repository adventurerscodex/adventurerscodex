import ko from 'knockout';

/**
 * card-edit-actions component
 *
 * A component that provides an action icon for the top of a card.
 * The Card Flip Button provides away for a user to flip/display a card
 *
 * @param reset {function} The method to flip/display a card.
 *
 * Usage:
 * <card-edit-actions params="{
 *       flip: flip
 *  }"></card-edit-actions>
 */
export class CardEditActionComponent {
    constructor(params) {
        this.flip = params.flip;
    }
    clickFlip = () => {
        this.flip();
    }
}

ko.components.register('card-edit-actions', {
    viewModel: CardEditActionComponent,
    template: '\
    <div class="btn-group edit-btn" role="group" aria-label="actionButtons">\
      <button class="btn btn-link" data-bind="click: $component.clickFlip">\
        <span class="glyphicon glyphicon-edit" style="color: #204d74" aria-hidden="true"></span>\
      </button>\
    </div>\
    '
});
