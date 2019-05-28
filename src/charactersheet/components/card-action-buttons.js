import ko from 'knockout';

export class CardActionButton {
    constructor(params) {
        this.reset = params.reset;
    }
    clickReset = () => {
        this.reset();
    }
}

ko.components.register('card-action-buttons', {
    viewModel: CardActionButton,
    template: '\
    <div class="btn-group edit-btn" role="group" aria-label="actionButtons">\
      <button class="btn btn-link" data-bind="click: clickReset" type="reset">\
        <span class="glyphicon glyphicon-remove-sign" style="color: #d62c1a" aria-hidden="true"></span>\
      </button>\
      <button class="btn btn-link" type="submit" value="submit">\
        <span class="glyphicon glyphicon-floppy-save" style="color: #4cae4c" aria-hidden="true"></span>\
      </button>\
    </div>\
    '
});
