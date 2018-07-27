import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class Monster extends KOModel {
    static __skeys__ = ['core', 'encounters'];

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
    markDownDescription = ko.pureComputed(function() {
        return this.description() ? this.description() : '';
    });

    nameLabel = ko.pureComputed(function() {
        var label = this.size() ? this.size() : '';
        label += this.type() ? (this.size() ? ' ' : '') + this.type() : '';
        label += (this.size() && this.alignment()) || (this.type() && this.alignment()) ? ', ' : '';
        label += this.alignment() ? this.alignment() : '';
        return label;
    });

    //Public Methods
    findAbilityScoreByName = function(name) {
        var foundScore;
        this.abilityScores().forEach(function(score, idx, _) {
            if (score.name().toLowerCase() == name.toLowerCase()) {
                foundScore = score;
            }
        });
        return foundScore;
    };
}
