import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';

export class Monster extends KOModel {
    static __skeys__ = ['core', 'encounters', 'monsters'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'uuid', 'name', 'size', 'type',
        'alignment', 'armorClass', 'hitPoints', 'speed', 'savingThrows',
        'skills', 'senses', 'damageVulnerabilities', 'damageImmunities', 'damageResistances',
        'conditionImmunities', 'languages', 'challenge', 'experience', 'description']
    };

    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    uuid = ko.observable();
    name = ko.observable();
    size = ko.observable();
    type = ko.observable();
    alignment = ko.observable();
    armorClass = ko.observable();
    hitPoints = ko.observable();
    speed = ko.observable();
    abilityScores = ko.observableArray([]);
    savingThrows = ko.observable();
    skills = ko.observable();
    senses = ko.observable();
    damageVulnerabilities = ko.observable();
    damageImmunities = ko.observable();
    damageResistances = ko.observable();
    conditionImmunities = ko.observable();
    languages = ko.observable();
    challenge = ko.observable();
    experience = ko.observable();
    description = ko.observable();

    // UI Stuff

    // todo: maybe remove?
    markDownDescription = ko.pureComputed(function() {
        let desc = '';
        if (this) {
            desc = this.description() ? this.description() : '';
        }

        return desc;
    });

    nameLabel = ko.pureComputed(function() {
        if (this) {
            var label = this.size() ? this.size() : '';
            label += this.type() ? (this.size() ? ' ' : '') + this.type() : '';
            label += (this.size() && this.alignment()) || (this.type() && this.alignment()) ? ', ' : '';
            label += this.alignment() ? this.alignment() : '';
            return label;
        }
    });

    //Public Methods
    findAbilityScoreByName = function(name) {
        var foundScore;
        this.abilityScores().forEach(function(score) {
            if (ko.unwrap(score.name).toLowerCase() == name.toLowerCase()) {
                foundScore = score;
            }
        });
        return foundScore;
    };
}

Monster.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 128
        },
        size: {
            maxlength: 32
        },
        type: {
            maxlength: 32
        },
        alignment: {
            maxlength: 32
        },
        armorClass: {
            required: true,
            number: true,
            min: 0
        },
        hitPoints: {
            required: true,
            maxlength: 32
        },
        speed: {
            maxlength: 64
        },
        senses: {
            maxlength: 256
        },
        savingThrows: {
            maxlength: 128
        },
        skills: {
            maxlength: 256
        },
        damageVulnerabilities: {
            maxlength: 256
        },
        damageImmunities: {
            maxlength: 256
        },
        damageResistances: {
            maxlength: 256
        },
        conditionImmunities: {
            maxlength: 256
        },
        languages: {
            maxlength: 256
        },
        challenge: {
            maxlength: 16
        },
        experience: {
            number: true,
            min: 0
        },
        strength: {
            required: true,
            min: 0
        },
        dexterity: {
            required: true,
            min: 0
        },
        constitution: {
            required: true,
            min: 0
        },
        intelligence: {
            required: true,
            min: 0
        },
        wisdom: {
            required: true,
            min: 0
        },
        charisma: {
            required: true,
            min: 0
        }
    }
};
