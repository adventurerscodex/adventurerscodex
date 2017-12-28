import ko from 'knockout';

/**
 * Enables the ability for any image to become full screened.
 *
 * @param imageSource {string: Required} url that points to an image
 * @param fullScreenStatus {string: Required} status of wether the image should still be full screen
 *
 * Usage:
 * ```
 * <full-screen-image params="imageSource: convertedDisplayUrl, fullScreenStatus: fullScreen">
 * </full-screen-image>
 * ```
 */
export function FullScreenImageComponentViewModel(params) {
    var self = this;

    self.imageSource = params.imageSource;
    self.fullScreenStatus = params.fullScreenStatus;

    self.toggleFullScreen = function() {
        self.fullScreenStatus(!self.fullScreenStatus());
    };
}

ko.components.register('full-screen-image', {
    viewModel: FullScreenImageComponentViewModel,
    template: '\
    <!-- ko if: fullScreenStatus -->\
    <div class="overlay clickable" data-bind="click: toggleFullScreen">\
        <img class="full-screen" data-bind="click: toggleFullScreen, attr: { src: imageSource }"/>\
    </div>\
    <!-- /ko -->'
});
