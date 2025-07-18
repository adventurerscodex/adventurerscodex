import Clipboard from 'clipboard';
import { ShareKey } from 'charactersheet/models/common';
import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';
import './form';

export class ShareViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
        this.modalStatus = params.modalStatus || ko.observable(false);
        this.core = params.core;
        this.userIsPatron = params.userIsPatron;
    }

    closeModal() {
        this.modalStatus(false);
    };

    modelClass () {
        return ShareKey;
    }

    setupClipboard() {
        // Clipboard initialization.
        const clipboard = new Clipboard('.copy', {
            container: document.getElementById('shareModal')
        });

        clipboard.on('success', function(e) {
            Notifications.userNotification.infoNotification.dispatch('Text copied to clipboard.', '');
            e.clearSelection();
        });
    };

    deleteLink = async function(link) {
        await link.ps.delete();
        this.entities(this.entities().filter(({ uuid }) => (
            ko.unwrap(uuid) !== ko.unwrap(link.uuid)
        )));
    };

    async createSharableLink() {
        const key = CoreManager.activeCore().uuid();
        let sharableKey = new ShareKey();
        sharableKey.coreUuid(key);
        const newKey = await sharableKey.ps.create();
        this.entities.push(newKey.object);
    };
}

ko.components.register('share', {
    viewModel: ShareViewModel,
    template: template
});
