'use strict';

function ImageModel() {
    var self = this;
    self.ps = PersistenceService.register(ImageModel, self);

    self.characterId = ko.observable(null);

    /**
     * The image data.
     */
    self.imageUrl = ko.observable('');

    self.save = function() {
        self.ps.save();
    };

    self.clear = function() {
        self.imageUrl('');
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.imageUrl(values.imageUrl);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            imageUrl: self.imageUrl()
        };
    };

    self.resize = function() {
        var compData = ImageModel.resizeImageData(
            self.imageUrl(), self.height(), self.width());
        self.imageUrl(compData);
        self.save();
    };

    /**
     * Returns whether or not the image is empty.
     */
    self.hasData = ko.pureComputed(function() {
        try {
            return (self.imageUrl().length > 10);
        } catch(err) {
            return false;
        }
    });
}

ImageModel.findBy = function(characterId) {
    return PersistenceService.findAll(ImageModel).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

/**
 * Given a dataURL for an uncompressed image, return the compressed
 * version of the URL.
 * Via: https://github.com/josefrichter/resize/blob/master/public/preprocess.js
 */
ImageModel.resizeImageData = function(dataUrl, max_height, max_width) {
    var img = new Image();
    img.src = dataUrl;
    var canvas = document.createElement('canvas');

    var width = img.width;
    var height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > max_width) {
            //height *= max_width / width;
            height = Math.round(height *= max_width / width);
            width = max_width;
        }
    } else {
        if (height > max_height) {
            //width *= max_height / height;
            width = Math.round(width *= max_height / height);
            height = max_height;
        }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    //preview.appendChild(canvas); // do the actual resized preview

    var data = canvas.toDataURL('image/jpeg'); // get the data from canvas as 70% JPG (can be also PNG, etc.)
    return data.length < 10 ? dataUrl : data;
};
