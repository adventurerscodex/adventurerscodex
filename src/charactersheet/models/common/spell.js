import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { SpellStats } from 'charactersheet/models/character/spell_stats';
import { includes } from 'lodash';
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

    spellDamageLabel = ko.observable('');

    isConcentration = ko.pureComputed(function() {
        return includes(this.duration().toLowerCase(), 'concentration');
    }, this);

    updateValues = async () => {
        await this.calculateSpellDamageLabel();
    };

    nameLabel = ko.pureComputed(() => {
        if (this.isRitual() === true) {
            return (this.name() + ' (Ritual)');
        } else {
            return this.name();
        }
    }, this);

    levelLabel = ko.pureComputed(() => {
        if (parseInt(this.level()) === 0) {
            return 'Cantrip';
        } else {
            return this.level();
        }
    }, this);

    isCastable = ko.pureComputed(function() {
        if (this.prepared() === true || this.alwaysPrepared() === true || this.level() == 0) {
            return true;
        } else {
            return false;
        }
    }, this);

    typeLabel = ko.pureComputed(function() {
        if (this.type() === 'Savings Throw') {
            return ('Savings Throw' + ': ' + this.spellSaveAttribute());
        } else {
            return this.type();
        }
    }, this);

    spellSummaryLabel = ko.pureComputed(() => {
        var header = parseInt(this.level()) !== 0 ? 'Level ' : '';
        return this.school() + ', ' + header + this.levelLabel();
    }, this);

    descriptionHTML = ko.pureComputed(() => {
        if (!this.description()) {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
        return this.description();
    }, this);

    spellDamageIcon = ko.pureComputed(() => {
        switch(this.damageType().toLowerCase()) {
        case 'fire': {
            return 'damage-icon damage-fire';
        }
        case 'cold': {
            return 'damage-icon damage-cold';
        }
        case 'lightning': {
            return 'damage-icon damage-lightning';
        }
        case 'thunder': {
            return 'damage-icon damage-thunder';
        }
        case 'poison': {
            return 'damage-icon damage-poison';
        }
        case 'acid': {
            return 'damage-icon damage-acid';
        }
        case 'psychic': {
            return 'damage-icon damage-psychic';
        }
        case 'necrotic': {
            return 'damage-icon damage-necrotic';
        }
        case 'radiant': {
            return 'damage-icon damage-radiant';
        }
        case 'force': {
            return 'damage-icon damage-force';
        }
        case 'bludgeoning': {
            return 'damage-icon damage-bludgeoning';
        }
        case 'piercing': {
            return 'damage-icon damage-piercing';
        }
        case 'slashing': {
            return 'damage-icon damage-slashing';
        }
        default:
            return '';
        }
    }, this);

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.spell.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.spell.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.spell.deleted.dispatch(this);
    }
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
            type: 'number',
            pattern: '\\d*',
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
