'use strict';

/**
 * markdown-edit-preview component
 * A component that displays 2 tabs: edit and preview, that allow the
 * user to edit the text contained in an observable as Markdown,
 * then preview the HTML version.
 * @param text {observable} an observable in which to save the value
 * @param rows {int: Optional} The number of default rows in the edit text area.
 * The default is 20.
 * Usage:
 * <markdown-edit-preview params="text: myValue, rows: 15"></markdown-edit-preview>
 */
function MarkdownEditPreviewComponentViewModel(params) {
    var self = this;

    self.text = params.text;
    self.rows = params.rows || ko.observable(20);
    self.min = params.min || ko.observable(0);

    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

    /* UI Methods */

    self.selectPreviewTab = function() {
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.editTabStatus('active');
        self.previewTabStatus('');
    };
}

ko.components.register('markdown-edit-preview', {
    viewModel: MarkdownEditPreviewComponentViewModel,
    template: '\
    <!-- Begin Tabs -->\
    <ul class="nav nav-tabs tabs">\
      <li role="presentation" data-bind="click: selectPreviewTab, css: previewTabStatus">\
        <a href="#" role="tab" data-toggle="tab">\
            <b>Preview</b>\
        </a>\
      </li>\
      <li role="presentation" data-bind="click: selectEditTab, css: editTabStatus">\
        <a href="#" role="tab" data-toggle="tab">\
            <b>Edit</b>\
        </a>\
      </li>\
    </ul>\
    <div class="tab-content">\
      <div role="tabpanel" data-bind="css: previewTabStatus"\
        class="tab-pane">\
        <div data-bind="markdownPreview: text"></div>\
      </div>\
      <div role="tabpanel" data-bind="css: editTabStatus"\
        class="tab-pane">\
        <div class="form-horizontal">\
          <div class="form-group">\
            <textarea class="form-control dark-area" rows="20"\
              placeholder="Captain\'s Log..."\
              data-bind="value: text, markdownEditor: true"></textarea>\
          </div>\
        </div>\
      </div>\
    </div>'
});
