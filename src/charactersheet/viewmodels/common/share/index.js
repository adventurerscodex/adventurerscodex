import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import Clipboard from 'clipboard';
import { ShareKey } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './index.html';

export function ShareViewModel(params) {
    var self = this;

    self.shareKeys = ko.observableArray([]);
    self.modalStatus = params.modalStatus || ko.observable(false);

    self.load = async () => {
        self.shareKeys(await self.getShareKeys());
    };

    self.unload = function() {
        self.modalStatus(false);
    };

    self.closeModal = function() {
        self.modalStatus(false);
    };

    self.setupClipboard = function() {
        // Clipboard initialization.
        var clipboard = new Clipboard('.copy', {
            container: document.getElementById('shareModal')
        });

        clipboard.on('success', function(e) {
            Notifications.userNotification.infoNotification.dispatch('Text copied to clipboard.', '');
            e.clearSelection();
        });
    };

    self.getShareKeys = async function() {
        var key = CoreManager.activeCore().uuid();
        const response = await ShareKey.ps.list({coreUuid: key});
        return response.objects;
    };

    self.deleteLink = async function(link) {
        await link.ps.delete();
        self.shareKeys(await self.getShareKeys());
    };

    self.createSharableLink = async function() {
        var key = CoreManager.activeCore().uuid();
        let sharableKey = new ShareKey();
        sharableKey.coreUuid(key);
        const newKey = await sharableKey.ps.create();
        self.shareKeys.push(newKey.object);
    };
}

ko.components.register('share', {
    viewModel: ShareViewModel,
    template: template
});
