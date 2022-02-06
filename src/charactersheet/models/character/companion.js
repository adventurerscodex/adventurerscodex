import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications, Utility } from 'charactersheet/utilities';
import ko from 'knockout';


const modifierLabel = (bonus) => {
    let bonusNumber = 0;
    if (bonus && !isNaN(bonus)) {
        bonusNumber = Math.floor((parseInt(bonus) - 10) / 2);
    }
    if (bonusNumber < 0) {
        return `- ${Math.abs(bonusNumber)}`;
    }
    return `+ ${bonusNumber}`;
};
export class Companion extends KOModel {
    static __skeys__ = ['core', 'companions'];

    static mapping = {
        include: ['coreUuid']
    };

    DANGER_THRESHOLD = 0.30;
    WARNING_THRESHOLD = 0.50;

    coreUuid = ko.observable(null);
    uuid = ko.observable();
    name = ko.observable();
    size = ko.observable();
    type = ko.observable();
    alignment = ko.observable();
    armorClass = ko.observable();
    hitPoints = ko.observable();
    maxHitPoints = ko.observable();
    damage = ko.observable();
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
    sourceUrl = ko.observable();
    description = ko.observable();

    hpPercent = ko.pureComputed(() => {
        return (
            (this.maxHitPoints() - this.damage())
                / (this.maxHitPoints())
        );
    });

    usesDisplay = ko.pureComputed(() => {
        return this.hitPoints() + ' / ' + this.maxHitPoints();
    });

    isDangerous = ko.pureComputed(() => {
        return this.hpPercent() < this.DANGER_THRESHOLD ? true : false;
    });

    isWarning = ko.pureComputed(() => {
        return this.hpPercent() < this.WARNING_THRESHOLD ? true : false;
    });


    nameLabel = ko.pureComputed(() => {
        if (this) {
            var label = this.size() ? this.size() : '';
            label += this.type() ? (this.size() ? ' ' : '') + this.type() : '';
            label += (this.size() && this.alignment()) || (this.type() && this.alignment()) ? ', ' : '';
            label += this.alignment() ? this.alignment() : '';
            return label;
        }
    });

    convertedDisplayUrl = ko.pureComputed(() => (
        Utility.string.createDirectDropboxLink(this.sourceUrl())
    ));
    

    findAbilityScoreByName = function(name) {
        var foundScore;
        this.abilityScores().forEach(function(score) {
            if (ko.unwrap(score.name).toLowerCase() == name.toLowerCase()) {
                foundScore = score;
            }
        });
        foundScore.modifierLabel = modifierLabel(ko.unwrap(foundScore.value));
        return foundScore;
    };

    // Helpers

    load = async (params) => {
        const response = await this.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.companion.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.companion.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.companion.deleted.dispatch(this);
    }

    // Overrides

    importValues = (values) => {
        ko.mapping.fromJS(values, this._mapping, this);

        // Now we just need to ensure that all ability scores are
        // well formed. The DR has incomplete model data.
        this.abilityScores().map(score => {
            if (!ko.unwrap(score.shortName)) {
                score.shortName = (
                    score.name()
                        .toUpperCase()
                        .substring(0, 3)
                );
            }
        });
    }
}

Companion.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 128
        },
        size: {
            maxlength: 64
        },
        type: {
            maxlength: 64
        },
        alignment: {
            maxlength: 64
        },
        armorClass: {
            required: true,
            number: true,
            min: 0,
            max: 10000
        },
        hitPoints: {
            required: true,
            maxlength: 64
        },
        maxHitPoints: {
            required: true,
            number: true,
            min: 0,
            max: 100000000
        },
        damage: {
            number: true,
            min: 0,
            max: 100000000
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
        strength: {
            required: true,
            min: -10000,
            max: 1000000
        },
        dexterity: {
            required: true,
            min: -10000,
            max: 1000000
        },
        constitution: {
            required: true,
            min: -10000,
            max: 1000000
        },
        intelligence: {
            required: true,
            min: -10000,
            max: 1000000
        },
        wisdom: {
            required: true,
            min: -10000,
            max: 1000000
        },
        charisma: {
            required: true,
            min: -10000,
            max: 1000000
        },
        sourceUrl: {
            url: true,
            maxlength: 1024
        }
    },
    rules: {
        name: {
            required: true,
            maxlength: 128
        },
        size: {
            maxlength: 64
        },
        type: {
            maxlength: 64
        },
        alignment: {
            maxlength: 64
        },
        armorClass: {
            required: true,
            number: true,
            min: 0,
            max: 10000
        },
        hitPoints: {
            required: true,
            maxlength: 64
        },
        maxHitPoints: {
            number: true,
            min: 0,
            max: 100000000
        },
        damage: {
            number: true,
            min: 0,
            max: 100000000
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
        strength: {
            required: true,
            min: -10000,
            max: 1000000
        },
        dexterity: {
            required: true,
            min: -10000,
            max: 1000000
        },
        constitution: {
            required: true,
            min: -10000,
            max: 1000000
        },
        intelligence: {
            required: true,
            min: -10000,
            max: 1000000
        },
        wisdom: {
            required: true,
            min: -10000,
            max: 1000000
        },
        charisma: {
            required: true,
            min: -10000,
            max: 1000000
        },
        sourceUrl: {
            url: true,
            maxlength: 1024
        }
    }
};
