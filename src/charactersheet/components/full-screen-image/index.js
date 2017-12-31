import './style.css';
import ko from 'knockout';
import template from './index.html';

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
    template: template
});
