'use strict';

var isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var getModifier = function(value){
    if (isNumeric(value)){
        return Math.floor((value - 10) / 2);
    }
    else {
        return null;
    }
};

var getStrModifier = function(modifier){
    if (modifier === null || modifier === '') {
        return '';
    }
    modifier = getModifier(modifier);
    if (modifier >= 0){
        modifier = '+ ' + modifier;
    }
    else{
        modifier = '- ' + Math.abs(modifier);
    }
    return modifier;
};

function AbilityScoresViewModel() {
    var self = this;

    self.abilityScores = ko.observable(new AbilityScores());
    self.modalStatus = ko.observable(false);
    self.firstModalElementHasFocus = ko.observable(false);

    self.init = function() {
        Notifications.global.save.add(function() {
            self.abilityScores().save();
        });
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var scores = AbilityScores.findBy(key);
        if (scores.length > 0) {
            self.abilityScores(scores[0]);
        } else {
            self.abilityScores(new AbilityScores());
        }
        self.abilityScores().characterId(key);

        //Subscriptions
        self.abilityScores().str.subscribe(self.dataHasChanged);
        self.abilityScores().dex.subscribe(self.dataHasChanged);
        self.abilityScores().con.subscribe(self.dataHasChanged);
        self.abilityScores().int.subscribe(self.dataHasChanged);
        self.abilityScores().wis.subscribe(self.dataHasChanged);
        self.abilityScores().cha.subscribe(self.dataHasChanged);
    };

    self.unload = function() {
        self.abilityScores().save();
    };

    self.dataHasChanged = function() {
        self.abilityScores().save();
        Notifications.abilityScores.changed.dispatch();
    };

    // Modal Methods

    self.openModal = function() {
        self.modalStatus(true);
         // Alert the modal even if the value didn't technically change.
        self.modalStatus.valueHasMutated();
    };

    self.modalFinishedAnimating = function() {
        self.firstModalElementHasFocus(true);
        self.firstModalElementHasFocus.valueHasMutated();
    };
}
