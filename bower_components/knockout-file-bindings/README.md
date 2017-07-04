knockout-file-bindings
======================

HTML5 File bindings for knockout js with drag and drop support and custom input buttons

## [See it in action](http://codepen.io/mrsafraz/pen/uIrwC)

## Basic Usage



**View Model**
```javascript
viewModel.fileData = ko.observable({
  dataURL: ko.observable()
});

viewModel.fileData().dataURL.subscribe(function(dataURL){
  // dataURL has changed do something with it!
});
```

**View**
```html
<input type="file" data-bind="fileInput: fileData">
```

With custom file input (`knockout-file-bindings.css` should be included)
```html
<!-- with custom file input: -->
<input type="file" data-bind="fileInput: fileData, , customFileInput: {}">
```

with Drag and Drop container (`knockout-file-bindings.css` should be included)
```html
<div data-bind="fileDrag: fileData">
  <input type="file" data-bind="fileInput: fileData, , customFileInput: {}">
</div>
```

with an Upload preview
```html
<div data-bind="fileDrag: fileData">
  <div class="image-upload-preview">
    <img data-bind="attr: { src: fileData().dataURL }, visible: fileData().dataURL">
  </div>
  <div class="image-upload-input">
    <input type="file" data-bind="fileInput: fileData, , customFileInput: {}">
  </div>
</div>
```

## Advanced usage

**View Model**
```javascript
ko.fileBindings.defaultOptions = {
  wrapperClass: 'input-group',
  fileNameClass: 'disabled form-control',
  noFileText: 'No file chosen',
  buttonGroupClass: 'input-group-btn',
  buttonClass: 'btn btn-primary',
  clearButtonClass: 'btn btn-default',
  buttonText: 'Choose File',
  changeButtonText: 'Change',
  clearButtonText: 'Clear',
  fileName: true, // show the selected file name?
  clearButton: true, // show clear button?
  onClear: function(fileData, options) {
      if (typeof fileData.clear === 'function') {
          fileData.clear();
      }
  }
};

// change a default option
ko.fileBindings.defaultOptions.buttonText = 'Browse';

viewModel.fileData = ko.observable({
  file: ko.observable(), // will be filled with a File object
  // Read the files (all are optional, e.g: if you're certain that it is a text file, use only text:
  binaryString: ko.observable(), // FileReader.readAsBinaryString(Blob|File) - The result property will contain the file/blob's data as a binary string. Every byte is represented by an integer in the range [0..255].
  text: ko.observable(), // FileReader.readAsText(Blob|File, opt_encoding) - The result property will contain the file/blob's data as a text string. By default the string is decoded as 'UTF-8'. Use the optional encoding parameter can specify a different format.
  dataURL: ko.observable(), // FileReader.readAsDataURL(Blob|File) - The result property will contain the file/blob's data encoded as a data URL.
  arrayBuffer: ko.observable(), // FileReader.readAsArrayBuffer(Blob|File) - The result property will contain the file/blob's data as an ArrayBuffer object.
  
  // a special observable (optional)
  base64String: ko.observable(), // just the base64 string, without mime type or anything else
});

viewModel.fileData().text.subscribe(function(text){
  // do something
});

viewModel.fileData().base64String.subscribe(function(base64String){
  sendToServer(base64String);
});

```

Recommended:
[Reading HTML5 files](http://www.html5rocks.com/en/tutorials/file/dndfiles/#toc-reading-files)

**View**
```html
<div class="well" data-bind="fileDrag: fileData">
    <div class="form-group row">
        <div class="col-md-6">
            <img style="height: 125px;" class="img-rounded  thumb" data-bind="attr: { src: fileData().dataURL }, visible: fileData().dataURL">
            <div data-bind="ifnot: fileData().dataURL">
                <label class="drag-label">Drag file here</label>
            </div>
        </div>
        <div class="col-md-6">
            <input type="file" data-bind="fileInput: fileData, customFileInput: {
              buttonClass: 'btn btn-success',
              fileNameClass: 'disabled form-control'
            }" accept="image/*">
        </div>
    </div>
</div>
```
