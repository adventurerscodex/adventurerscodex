import {
    CoreManager,
    Fixtures
} from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { SpellStats } from 'charactersheet/models/character/spell_stats';
import ko from 'knockout';


export class Spell extends KOModel {
    static __skeys__ = ['core', 'spells'];

    static mapping = {
        include: ['coreUuid']
    };

    _dummy = ko.observable();
    coreUuid = ko.observable(null);
    name = ko.observable('');
    prepared = ko.observable(false);
    alwaysPrepared = ko.observable(false);
    type = ko.observable('');
    spellSaveAttr = ko.observable('');
    damage = ko.observable('');
    damageType = ko.observable('');
    school = ko.observable('');
    level = ko.observable(1);
    description = ko.observable('');
    castingTime = ko.observable('');
    range = ko.observable('');
    components = ko.observable('');
    duration = ko.observable('');
    materialComponents = ko.observable('');
    isRitual = ko.observable(false);

    typeOptions = ko.observableArray(Fixtures.spell.typeOptions);
    spellSaveAttrOptions = ko.observableArray(Fixtures.spell.spellSaveAttrOptions);
    schoolOptions = ko.observableArray(Fixtures.spell.schoolOptions);
    castingTimeOptions = ko.observableArray(Fixtures.spell.castingTimeOptions);
    durationOptions = ko.observableArray(Fixtures.spell.durationOptions);
    componentsOptions = ko.observableArray(Fixtures.spell.componentsOptions);
    rangeOptions = ko.observableArray(Fixtures.spell.rangeOptions);

    updateValues = () => {
        this._dummy.notifySubscribers();
    };

    nameLabel = ko.pureComputed(() => {
        if (this.isRitual() === true) {
            return (this.name() + ' (Ritual)');
        } else {
            return this.name();
        }
    });

    spellDamageLabel = ko.pureComputed(() => {
        this._dummy();
        var key = CoreManager.activeCore().uuid();
        return this.damage();
        // TODO: NEED SPELL STATS FOR THIS
        // var spellStats = PersistenceService.findBy(SpellStats, 'characterId', key)[0];
        // if (type() === 'Attack Roll') {
        //     var spellBonus = spellStats ? spellStats.spellAttackBonus() : 0;
        //     return (this.damage() + ' [Spell Bonus: +' + spellBonus + ']');
        // }
        // else {
        //     return this.damage();
        // }
    });

    levelLabel = ko.pureComputed(() => {
        if (parseInt(this.level()) === 0) {
            return 'Cantrip';
        } else {
            return this.level();
        }
    });

    spellSummaryLabel = ko.pureComputed(() => {
        var header = parseInt(this.level()) !== 0 ? 'Level ' : '';
        return this.school() + ', ' + header + this.levelLabel();
    });

    descriptionHTML = ko.pureComputed(() => {
        if (this.description()) {
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });
}