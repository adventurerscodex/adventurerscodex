import ko from 'knockout';

export class FormCardFooter {
    constructor(params) {
        this.reset = params.reset;
        this.delete = params.delete;
        this.addForm = params.addForm;
        this.showDisclaimer = params.showDisclaimer;
    }
    clickReset = () => {
        this.reset();
    }
    clickDelete = () => {
        this.delete();
    }
}

ko.components.register('form-card-footer', {
    viewModel: FormCardFooter,
    template: '\
      <p class="text-muted text-left" style="padding: 10px;" data-bind="visible: $component.showDisclaimer">\
        <sm><i>This data is distributed under the\
            <a href="http://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf" target="_blank">OGL</a>\
            <br />Open Game License v 1.0a Copyright 2000, Wizards of the Coast, LLC.\
            </i>\
        <sm>\
      </p>\
      <div class="col-xs-12">\
        <div data-bind="ifnot: $component.addForm" class="pull-left">\
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
