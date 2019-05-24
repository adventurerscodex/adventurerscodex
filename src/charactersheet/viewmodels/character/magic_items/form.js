import {
  CoreManager,
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';


import { FormController } from 'charactersheet/components/form-controller-component';

import { MagicItem } from 'charactersheet/models';

import { debounce } from 'lodash';
import ko from 'knockout';
import template from './form.html';


export class MagicItemFormViewModel  extends FormController {
    generateBlank() {
        return new MagicItem();
    }

    typeOptions = Fixtures.magicItem.magicItemTypeOptions;
    rarityOptions = Fixtures.magicItem.magicItemRarityOptions;


    // Pre-populate methods
    setMagicItemType = (label, value) => {
        this.entity().type(value);
    };

    setMagicItemRarity = (label, value) => {
        this.entity().rarity(value);
    }


    spellsPrePopFilter = (request, response) => {
        var term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.spells
                    ? Object.keys(DataRepository.spells)
                    : [];
            results = keys.filter(function(name, idx, _) {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };
    /* Modal Methods */
    magicItemsPrePopFilter = function(request, response) {
        const term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.magicItems
                  ? Object.keys(DataRepository.magicItems)
                  : [];
            results = keys.filter((name) => {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };

    populateMagicItem = (label, value) => {
        const magicItem = DataRepository.magicItems[label];
        this.entity().importValues(magicItem);
        this.shouldShowDisclaimer(true);
    };

    notify = () => {
        Notifications.magicItem.changed.dispatch();
    }

    validation = {


        ...MagicItem.validationConstraints
    };
}

ko.components.register('magic-item-form', {
    viewModel: MagicItemFormViewModel,
    template: template
});
