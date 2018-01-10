import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import {
    CharacterManager,
    Fixtures
} from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { SpellStats } from 'charactersheet/models/character/spell_stats';
import ko from 'knockout';


export function Spell() {
    var self = this;
    self.ps = PersistenceService.register(Spell, self);
    self.mapping = {
        include: ['characterId', 'spellName', 'spellPrepared', 'spellType', 'spellSaveAttr',
            'spellDmg', 'spellDmgType', 'spellSchool', 'spellLevel', 'spellDescription', 'spellCastingTime',
            'spellRange', 'spellComponents', 'spellDuration', 'spellPrepared',
            'spellAlwaysPrepared', 'spellMaterialComponents', 'isRitual']
    };

    self._dummy = ko.observable(null);
    self.characterId = ko.observable(null);
    self.spellName = ko.observable('');
    self.spellPrepared = ko.observable(false);
    self.spellAlwaysPrepared = ko.observable(false);
    self.spellType = ko.observable('');
    self.spellSaveAttr = ko.observable('');
    self.spellDmg = ko.observable('');
    self.spellDmgType = ko.observable('');
    self.spellSchool = ko.observable('');
    self.spellLevel = ko.observable(1);
    self.spellDescription = ko.observable('');
    self.spellCastingTime = ko.observable('');
    self.spellRange = ko.observable('');
    self.spellComponents = ko.observable('');
    self.spellDuration = ko.observable('');
    self.spellMaterialComponents = ko.observable('');
    self.isRitual = ko.observable(false);

    self.spellTypeOptions = ko.observableArray(Fixtures.spell.spellTypeOptions);
    self.spellSaveAttrOptions = ko.observableArray(Fixtures.spell.spellSaveAttrOptions);
    self.spellSchoolOptions = ko.observableArray(Fixtures.spell.spellSchoolOptions);
    self.spellCastingTimeOptions = ko.observableArray(Fixtures.spell.spellCastingTimeOptions);
    self.spellDurationOptions = ko.observableArray(Fixtures.spell.spellDurationOptions);
    self.spellComponentsOptions = ko.observableArray(Fixtures.spell.spellComponentsOptions);
    self.spellRangeOptions = ko.observableArray(Fixtures.spell.spellRangeOptions);

    self.updateValues = function() {
        self._dummy.notifySubscribers();
    };

    self.spellNameLabel = ko.pureComputed(function() {
        if (self.isRitual() === true) {
            return (self.spellName() + ' (Ritual)');
        } else {
            return self.spellName();
        }
    });

    self.spellDamageLabel = ko.pureComputed(function() {
        self._dummy();
        var key = CharacterManager.activeCharacter().key();
        var spellStats = PersistenceService.findBy(SpellStats, 'characterId', key)[0];
        if (self.spellType() === 'Attack Roll') {
            var spellBonus = spellStats ? spellStats.spellAttackBonus() : 0;
            return (self.spellDmg() + ' [Spell Bonus: +' + spellBonus + ']');
        }
        else {
            return self.spellDmg();
        }
    });

    self.spellLevelLabel = ko.pureComputed(function() {
        if(parseInt(self.spellLevel()) === 0){
            return 'Cantrip';
        } else {
            return self.spellLevel();
        }
    });

    self.spellIsCastable = ko.pureComputed(function() {
        if (self.spellPrepared() === true || self.spellAlwaysPrepared() === true || self.spellLevel() === 0) {
            return true;
        } else {
            return false;
        }
    });

    self.spellTypeLabel = ko.pureComputed(function() {
        if (self.spellType() === 'Savings Throw') {
            return ('Savings Throw' + ': ' + self.spellSaveAttr());
        } else {
            return self.spellType();
        }
    });

    self.spellSummaryLabel = ko.pureComputed(function() {
        var header = parseInt(self.spellLevel()) !== 0 ? 'Level ' : '';
        return self.spellSchool() + ', ' + header + self.spellLevelLabel();
    });

    self.spellDescriptionHTML = ko.pureComputed(function() {
        if (self.spellDescription()) {
            return self.spellDescription().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    self.clear = function() {
        var values = new Spell().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}
Spell.__name = 'Spell';

PersistenceService.addToRegistry(Spell);
