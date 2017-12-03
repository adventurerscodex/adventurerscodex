import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';

export var isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};


export var getModifier = function(value){
    if (isNumeric(value)){
        return Math.floor((value - 10) / 2);
    }
    else {
        return null;
    }
};


export var getStrModifier = function(modifier){
    if (modifier === null || modifier === '') {
        return '';
    }
    modifier = getModifier(modifier);
    if (modifier >= 0) {
        modifier = '+ ' + modifier;
    }
    else {
        modifier = '- ' + Math.abs(modifier);
    }
    return modifier;
};


export function AbilityScores() {

    var self = this;
    self.ps = PersistenceService.register(AbilityScores, self);
    self.mapping = {
        include: ['characterId', 'str', 'dex', 'con', 'int', 'wis', 'cha']
    };

    self.characterId = ko.observable(null);

    self.str =  ko.observable(null);
    self.strModifier = ko.pureComputed(function(){
        return getStrModifier(self.str());
    });

    self.dex =  ko.observable(null);
    self.dexModifier = ko.pureComputed(function(){
        return getStrModifier(self.dex());
    });

    self.con =  ko.observable(null);
    self.conModifier = ko.pureComputed(function(){
        return getStrModifier(self.con());
    });

    self.int =  ko.observable(null);
    self.intModifier = ko.pureComputed(function(){
        return getStrModifier(self.int());
    });

    self.wis =  ko.observable(null);
    self.wisModifier = ko.pureComputed(function(){
        return getStrModifier(self.wis());
    });

    self.cha =  ko.observable(null);
    self.chaModifier = ko.pureComputed(function(){
        return getStrModifier(self.cha());
    });

    //Public Methods

    self.modifierFor = function(score) {
        var val = null;
        switch(score.toLowerCase()) {
        case 'str':
            val = self.str();
            break;
        case'dex':
            val = self.dex();
            break;
        case'con':
            val = self.con();
            break;
        case'int':
            val = self.int();
            break;
        case'wis':
            val = self.wis();
            break;
        case'cha':
            val = self.cha();
            break;
        }
        return getModifier(val);
    };

    self.clear = function() {
        var values = new AbilityScores().exportValues();
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
}
AbilityScores.__name = "AbilityScores";

PersistenceService.addToRegistry(AbilityScores);
