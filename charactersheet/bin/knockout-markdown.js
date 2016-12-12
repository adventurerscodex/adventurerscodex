'use strict';

/**
 * A binding to apply a markdown editor to a text area. This binding has 2
 * parameters: a required variable to save the text in, and an optional
 * placeholder string.
 *
 * Using Plugin:
 * http://www.jqueryscript.net/text/Textarea-Based-Markdown-Editor-with-jQuery.html
 *
 * Options List from the plugin description.
 * -----------------------------------------
 * tabSize: 4,
 * onInsertedList: null,
 * onInsertedTable: null,
 * onInsertedCodeblock: null,
 * onSortedTable: null,
 * onMadeTable: null,
 * tabToSpace: true,
 * list: true,
 * table: true,
 * fontDecorate: true,
 * codeblock: true,
 * autoTable: true,
 * tableSeparator: '---',
 * csvToTable: true,
 * sortTable: true,
 * uploadingFormat: function(name) {
 *   return "![Uploading... " + name + "]()";
 * }
 *
 * Usage: data-bind="markdown: true"
 */
ko.bindingHandlers.markdownEditor = {
    editors: {},
    init: function(element, valueAccessor, allBindings) {
        var value = ko.unwrap(valueAccessor());
        var editor = $(element).markdownEditor();
    }
};

/**
 * A binding for parsed markdown HTML previews. Hand this binding an observable
 * containing markdown text and it will set the element's HTML to the parsed value.
 *
 * Usage:
 * <div data-bind="markdownPreview: myText"></div>
 */
ko.bindingHandlers.markdownPreview = {
    init: function(element, valueAccessor, allBindings) {
        var value = ko.unwrap(valueAccessor()) || '';
        $(element).html(marked(value));
    },
    update: function(element, valueAccessor, allBindings) {
        var value = ko.unwrap(valueAccessor()) || '';
        $(element).html(marked(value));
    }
};
