import { ScoreSaveFormViewModel } from './form';
import { ScoreSaveViewModel } from './view';

import ko from 'knockout';
import template from './index.html';

class ACScoreModel {

    order = [
        'Strength',
        'Dexterity',
        'Constitution',
        'Intelligence',
        'Wisdom',
        'Charisma'
    ];
}


ko.components.register('ability-scores', {
    viewModel: ACScoreModel,
    template: template
});
