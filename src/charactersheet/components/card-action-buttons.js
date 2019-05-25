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
      <button class="btn btn-link btn-danger" data-bind="click: clickReset" type="reset">\
        <span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>\
      </button>\
      <button class="btn btn-link btn-success" type="submit" value="submit">\
        <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>\
      </button>\
    </div>\
    '
});
