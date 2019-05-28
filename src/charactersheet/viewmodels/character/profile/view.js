
import { ACViewModel } from 'charactersheet/components/view-component';
import { Core } from 'charactersheet/models/common/core';
import { CoreManager } from 'charactersheet/utilities';
import { Fixtures } from 'charactersheet/utilities';
import { Profile } from 'charactersheet/models/character';

import autoBind from 'auto-bind';

import ko from 'knockout';
import template from './view.html';

export class ProfileViewModel extends ACViewModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    generateBlank() {
        return new Profile();
    }

    refresh = async () => {
        var key = CoreManager.activeCore().uuid();
        const profileResponse = await Profile.ps.read({uuid: key});
        this.entity().importValues(profileResponse.object.exportValues());
    };

    isNumeric = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    weightLabel = ko.computed(() => {
        if (this.isNumeric(this.entity().weight())) {
            return this.entity().weight()+ ' (lbs)';
        } else {
            return 'No Weight';
        }
    });

}

ko.components.register('profile-view', {
    viewModel: ProfileViewModel,
    template: template
});
