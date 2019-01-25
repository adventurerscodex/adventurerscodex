import 'bin/knockout-markdown';
import ko from 'knockout';

/**
 * markdown-edit-preview component
 *
 * A component that displays 2 tabs: edit and preview, that allow the
 * user to edit the text contained in an observable as Markdown,
 * then preview the HTML version.
 *
 * @param text {observable} an observable in which to save the value
 * @param rows {int: Optional} The number of default rows in the edit text area.
 * The default is 20.
 * @param defaultActiveTab {string} ['preview', 'edit'] used to determined which tab to show on
 * start. By default, edit is shown if there is no content. Else, preview.
 * @param placeholder {observable|text} Text that should display as the placeholder.
 * @param save {function} The method that will be invoked when the user desires to save their note
 * @param cancel {function} The method that will be invoked when
 * the user wishes to cancel their changes
 *
 * Usage:
 * <markdown-edit-preview params="text: notes().contents,
      rows: 20,
      placeholder: 'The party enters a dark...',
      defaultActiveTab: 'edit',
      save: saveNote,
      cancel: reset"></markdown-edit-preview>
 */
export function MarkdownEditPreviewComponentViewModel(params) {
    var self = this;

    self.text = params.text;
    self.rows = params.rows || ko.observable(20);
    self.placeholder = params.placeholder || ko.observable();

    self.previewTabStatus = ko.observable('');
    self.editTabStatus = ko.observable('');
    self.editMode = ko.observable(false);

    /* UI Methods */

    self.cancelAndResetNote = function () {
        params.cancel();
        self.selectPreviewTab();
        self.editMode(false);
    };

    self.selectPreviewTab = function () {
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function () {
        self.editTabStatus('active');
        self.previewTabStatus('');
    };

    self.saveButton = function () {
        params.save();
        self.selectPreviewTab();
        self.editMode(false);
    };

    self.toggleEditMode = function () {
        self.selectEditTab();
        self.editMode(true);
    };

    // Select the default tab,
    // or the preview tab if there's existing content.
    if (ko.unwrap(self.text) || ko.unwrap(params.defaultActiveTab) === 'preview') {
        self.selectPreviewTab();
    } else {
        self.selectEditTab();
        self.editMode(true);
    }
}

ko.components.register('markdown-edit-preview', {
    viewModel: MarkdownEditPreviewComponentViewModel,
    template: '\
    <!-- Begin Tabs -->\
    <ul class="nav nav-tabs tabs">\
        <!-- ko if: editMode -->\
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
        <!-- /ko -->\
        <!-- Right side of nav bar -->\
        <li role="presentation" class="secondary-nav">\
            <!-- ko if: editMode -->\
                <button class="btn btn-sm btn-primary"\
                        id="environmentSaveButton"\
                        data-bind="click: saveButton">\
                <i class="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;\
                Save\
                </button>\
                <button class="btn btn-sm btn-default"\
                        id="environmentSaveButton"\
                        data-bind="click: cancelAndResetNote">\
                Cancel\
                </button>\
            <!-- /ko -->\
            <!-- ko ifnot: editMode -->\
                <button class="btn btn-sm btn-primary" data-bind="click: toggleEditMode">\
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;Edit\
                </button>\
            <!-- /ko -->\
        </li>\
    </ul>\
    <div class="tab-content">\
      <div role="tabpanel" data-bind="css: previewTabStatus" \
        class="tab-pane">\
            <div class="row row-padded">\
                <div class="col-xs-12 col-padded">\
                    <div data-bind="markdownPreview: text"></div>\
                </div>\
            </div>\
      </div>\
      <div role="tabpanel" data-bind="css: editTabStatus" \
        class="tab-pane">\
        <div class="form-horizontal">\
          <textarea class="form-control dark-area" rows="20"\
            data-bind="textInput: text, markdownEditor: true, \
              attr: { placeholder: placeholder }">\
          </textarea>\
        </div>\
      </div>\
      <small class="text-muted">Text in this panel can be styled using Markdown. Click \
        <a target="_blank" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">here</a>\
        to see a guide.\
      </small>\
    </div>'
});
