/*
 * knockout-file-bindings
 * Copyright 2014 Muhammad Safraz Razik
 * All Rights Reserved.
 * Use, reproduction, distribution, and modification of this code is subject to the terms and
 * conditions of the MIT license, available at http://www.opensource.org/licenses/mit-license.php
 *
 * Author: Muhammad Safraz Razik
 * Project: https://github.com/adrotec/knockout-file-bindings
 */
(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), require("jquery"));
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "jquery"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, jQuery);
    }
}(function (ko, $) {

    var fileBindings = {
        customFileInputSystemOptions: {
            wrapperClass: 'custom-file-input-wrapper',
            fileNameClass: 'custom-file-input-file-name',
            buttonGroupClass: 'custom-file-input-button-group',
            buttonClass: 'custom-file-input-button',
            clearButtonClass: 'custom-file-input-clear-button',
            buttonTextClass: 'custom-file-input-button-text',
        },
        defaultOptions: {
            wrapperClass: 'input-group',
            fileNameClass: 'disabled form-control',
            noFileText: 'No file chosen',
            buttonGroupClass: 'input-group-btn',
            buttonClass: 'btn btn-primary',
            clearButtonClass: 'btn btn-default',
            buttonText: 'Choose File',
            changeButtonText: 'Change',
            clearButtonText: 'Clear',
            fileName: true,
            clearButton: true,
            onClear: function(fileData, options) {
                if (typeof fileData.clear === 'function') {
                    fileData.clear();
                }
            }
        },
    }

    var windowURL = window.URL || window.webkitURL;

    ko.bindingHandlers.fileInput = {
        init: function(element, valueAccessor) {
            element.onchange = function() {
                var fileData = ko.utils.unwrapObservable(valueAccessor()) || {};
                if (fileData.dataUrl) {
                    fileData.dataURL = fileData.dataUrl;
                }
                if (fileData.objectUrl) {
                    fileData.objectURL = fileData.objectUrl;
                }
                fileData.file = fileData.file || ko.observable();

                var file = this.files[0];
                if (file) {
                    fileData.file(file);
                }

                if (!fileData.clear) {
                    fileData.clear = function() {
                        $.each(['file', 'objectURL', 'base64String', 'binaryString', 'text', 'dataURL', 'arrayBuffer'], function(i, property) {
                            if (fileData[property] && ko.isObservable(fileData[property])) {
                                if (property == 'objectURL') {
                                    windowURL.revokeObjectURL(fileData.objectURL());
                                }
                                fileData[property](null);
                            }
                        });
                        element.value = '';
                    }
                }
                if (ko.isObservable(valueAccessor())) {
                    valueAccessor()(fileData);
                }
            };
            element.onchange();
        },
        update: function(element, valueAccessor, allBindingsAccessor) {

            var fileData = ko.utils.unwrapObservable(valueAccessor());

            var file = ko.isObservable(fileData.file) && fileData.file();

            if (fileData.objectURL && ko.isObservable(fileData.objectURL)) {
                var newUrl = file && windowURL.createObjectURL(file);
                if (newUrl) {
                    var oldUrl = fileData.objectURL();
                    if (oldUrl) {
                        windowURL.revokeObjectURL(oldUrl);
                    }
                    fileData.objectURL(newUrl);
                }
            }


            if (fileData.base64String && ko.isObservable(fileData.base64String)) {
                if (fileData.dataURL && ko.isObservable(fileData.dataURL)) {
                    // will be handled
                }
                else {
                    fileData.dataURL = ko.observable(); // hack
                }
            }

            // var properties = ['binaryString', 'text', 'dataURL', 'arrayBuffer'], property;
            // for(var i = 0; i < properties.length; i++){
            //     property = properties[i];
            ['binaryString', 'text', 'dataURL', 'arrayBuffer'].forEach(function(property){
                var method = 'readAs' + (property.substr(0, 1).toUpperCase() + property.substr(1));
                if (property != 'dataURL' && !(fileData[property] && ko.isObservable(fileData[property]))) {
                    return true;
                }
                if (!file) {
                    return true;
                }
                var reader = new FileReader();
                reader.onload = function(e) {
                    if (fileData[property]) {
                        fileData[property](e.target.result);
                    }
                    if (method == 'readAsDataURL' && fileData.base64String && ko.isObservable(fileData.base64String)) {
                        var resultParts = e.target.result.split(",");
                        if (resultParts.length === 2) {
                            fileData.base64String(resultParts[1]);
                        }
                    }
                };

                reader[method](file);
            });
        }
    };

    ko.bindingHandlers.fileDrag = {
        update: function(element, valueAccessor, allBindingsAccessor) {
            var fileData = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (!$(element).data("fileDragInjected")) {
                element.classList.add('filedrag');
                element.ondragover = element.ondragleave = element.ondrop = function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if(e.type == 'dragover'){
                        element.classList.add('hover');
                    }
                    else {
                        element.classList.remove('hover');
                    }
                    if (e.type == 'drop' && e.dataTransfer) {
                        var files = e.dataTransfer.files;
                        var file = files[0];
                        if (file) {
                            fileData.file(file);
                            if (ko.isObservable(valueAccessor())) {
                                valueAccessor()(fileData);
                            }
                        }
                    }
                };

                $(element).data("fileDragInjected", true);
            }
        }
    };

    ko.bindingHandlers.customFileInput = {
        init: function(element, valueAccessor, allBindingsAccessor) {
            if (ko.utils.unwrapObservable(valueAccessor()) === false) {
                return;
            }
            //*
            var sysOpts = fileBindings.customFileInputSystemOptions;
            var defOpts = fileBindings.defaultOptions;

            var $element = $(element);
            var $wrapper = $('<span>').addClass(sysOpts.wrapperClass).addClass(defOpts.wrapperClass);
            var $buttonGroup = $('<span>').addClass(sysOpts.buttonGroupClass).addClass(defOpts.buttonGroupClass);
            $buttonGroup.append($('<span>').addClass(sysOpts.buttonClass));
            $element.wrap($wrapper).wrap($buttonGroup);
            var $buttonGroup = $element.parent('.' + sysOpts.buttonClass).parent();
            $buttonGroup.before($('<input>').attr('type', 'text').attr('disabled', 'disabled').addClass(sysOpts.fileNameClass));
            $element.before($('<span>').addClass(sysOpts.buttonTextClass));

        },
        update: function(element, valueAccessor, allBindingsAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor());
            if (options === false) {
                return;
            }
            options = options || {};
            if (options && typeof options !== 'object') {
                options = {};
            }

            var sysOpts = fileBindings.customFileInputSystemOptions;
            var defOpts = fileBindings.defaultOptions;

            options = $.extend(defOpts, options);

            var allBindings = allBindingsAccessor();
            if (!allBindings.fileInput) {
                return;
            }
            var fileData = ko.utils.unwrapObservable(allBindings.fileInput) || {};

            var file = ko.utils.unwrapObservable(fileData.file);

            var $button = $(element).parent();
            var $buttonGroup = $button.parent();

            var $wrapper = $buttonGroup.parent();
            $button.addClass(ko.utils.unwrapObservable(options.buttonClass));
            $button.find('.' + sysOpts.buttonTextClass)
                    .html(ko.utils.unwrapObservable(file ? options.changeButtonText : options.buttonText));
            var $fileName = $wrapper.find('.' + sysOpts.fileNameClass);
            $fileName.addClass(ko.utils.unwrapObservable(options.fileNameClass));

            if (file && file.name) {
                $fileName.val(file.name);
            }
            else {
                $fileName.val(ko.utils.unwrapObservable(options.noFileText));
            }

            var $clearButton = $buttonGroup.find('.' + sysOpts.clearButtonClass);
            if (!$clearButton.length) {
                $clearButton = $('<span>').addClass(sysOpts.clearButtonClass);
                $clearButton.on('click', function(e) {
                    options.onClear(fileData, options);
                });
                $buttonGroup.append($clearButton);
            }
            $clearButton.html(ko.utils.unwrapObservable(options.clearButtonText));
            $clearButton.addClass(ko.utils.unwrapObservable(options.clearButtonClass));


            if (file && options.clearButton && file.name) {
//                $clearButton.show();
            }
            else {
                $clearButton.remove();
            }
        }
    };

    ko.fileBindings = fileBindings;
    return fileBindings;
}));
