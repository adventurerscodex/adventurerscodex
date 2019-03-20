import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
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
        include: ['coreUuid', 'prepared']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    prepared = ko.observable(false);
    alwaysPrepared = ko.observable(false);
    type = ko.observable('');
    spellSaveAttribute = ko.observable('');
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

    spellDamageLabel = ko.observable('');

    updateValues = async () => {
        await this.calculateSpellDamageLabel();
    };

    nameLabel = ko.pureComputed(() => {
        if (this.isRitual() === true) {
            return (this.name() + ' (Ritual)');
        } else {
            return this.name();
        }
    });

    calculateSpellDamageLabel = async () => {
        var key = CoreManager.activeCore().uuid();
        if (this.type() === 'Attack Roll') {
            const spellStatsResponse = await SpellStats.ps.read({ uuid: key });
            const spellStats = spellStatsResponse.object;
            var spellBonus = spellStats ? spellStats.spellAttackBonus() : 0;
            this.spellDamageLabel(this.damage() + ' [Spell Bonus: +' + spellBonus + ']');
        } else {
            this.spellDamageLabel(this.damage());
        }
    };

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

Spell.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        type: {
            required: true,
            maxlength: 128
        },
        spellSaveAttribute: {
            maxlength: 3,
            required: true
        },
        damage: {
            maxlength: 128
        },
        damageType: {
            maxlength: 128
        },
        school: {
            maxlength: 128,
            required: true
        },
        level: {
            min: 0,
            max: 10000,
            number: true,
            required: true
        },
        castingTime: {
            maxlength: 128,
            required: true
        },
        range: {
            maxlength: 128,
            required: true
        },
        duration: {
            maxlength: 128,
            required: true
        },
        components: {
            maxlength: 256,
            required: true
        }
    }
};
