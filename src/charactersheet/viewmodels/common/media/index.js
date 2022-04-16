import { ImageMedia } from 'charactersheet/models';
import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

export class ImageMediaViewModel extends AbstractTabularViewModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.setImageUrl = params.setImageUrl;
        this.flip = params.flip;
    }

    modelClass () {
        return ImageMedia;
    }

    async refresh() {
        const response = await this.modelClass().ps.list();
        this.entities(response.objects);
    }

    selectImage({ file }) {
        if (this.setImageUrl) {
            this.setImageUrl(file());
        }
        if (this.flip) {
            this.flip();
        }
    }

    // Custom scrolling

    scrollLeft(vm, event) {
        const list = (
            $(event.target)
            .parents('.media-manager')
            .find('.media-list')
        );
        list.animate({ scrollLeft: '-=300' }, 300);
    }

    scrollRight(a) {
        const list = (
            $(event.target)
            .parents('.media-manager')
            .find('.media-list')
        );
        list.animate({ scrollLeft: '+=300' }, 300);
    }
}

ko.components.register('media-browser', {
    viewModel: ImageMediaViewModel,
    template: template
});
