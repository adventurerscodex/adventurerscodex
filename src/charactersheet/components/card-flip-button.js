import ko from 'knockout';

export class CardFlipButton {
    constructor(params) {
        this.flip = params.flip;
    }
    clickflip = () => {
        this.flip();
    }
}

ko.components.register('card-flip-button', {
    viewModel: CardFlipButton,
    template: '\
    <div class="btn-group edit-btn" role="group" aria-label="actionButtons">\
      <button class="btn btn-link" data-bind="click: clickFlip">\
        <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>\
      </button>\
    </div>\
    '
});
