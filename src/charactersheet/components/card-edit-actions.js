import ko from 'knockout';

const ViewMode = {
    // Show all fields in the UI
    all: 'all',
    // Show the UI as it would appear in the exhibit
    exhibit: 'exhibit',
    // Show the UI as it would appear in the player share-sheet.
    player: 'player',
};

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

    // Show the `next` value for the text.
    modes = {
        [ViewMode.all]: 'View as Exhibit',
        [ViewMode.exhibit]: 'View as Player Mode',
        [ViewMode.player]: 'View All',
    };

    constructor(params) {
        this.flip = params.flip;
        this.mode = params.mode;
    }

    text = ko.pureComputed(() => this.modes[this.mode()]);

    clickFlip = () => {
        this.flip();
    }

    clickToggleDisplayMode = () => {
        if (!this.mode) { return; }

        if (this.mode() === ViewMode.all) {
            this.mode(ViewMode.exhibit);
        } else if (this.mode() === ViewMode.exhibit) {
            this.mode(ViewMode.player)
        } else {
            this.mode(ViewMode.all);
        }
    }

}

ko.components.register('card-edit-actions', {
    viewModel: CardEditActionComponent,
    template: '\
    <div class="btn-group edit-btn" role="group" aria-label="actionButtons">\
      <!-- ko if: mode -->\
      <button class="btn btn-link text-hover-only" data-bind="click: $component.clickToggleDisplayMode">\
        <!-- ko if: text -->\
        <span class="mr-1 text-muted" data-bind="text: text"></span>\
        <!-- /ko -->\
        <i class="fa fa-eye fa-color-hover-success fa-color fa-lg clickable" aria-hidden="true"></i>\
      </button>\
      <!-- /ko -->\
      <button class="btn btn-link" data-bind="click: $component.clickFlip">\
        <span class="fa fa-pencil-square-o fa-color-hover-success fa-color fa-lg clickable" aria-hidden="true"></span>\
      </button>\
    </div>\
    '
});
