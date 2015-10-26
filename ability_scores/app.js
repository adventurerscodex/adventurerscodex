"use strict";

var getModifier = function(value){
  return Math.floor((value - 10) / 2)
};

function AbilityScores() {
    var self = this;

    self.str =  ko.observable(18);
    self.strModifier = ko.computed(function(){
        var modifier = getModifier(self.str());
      if (modifier >= 0){
        modifier = '+ ' + modifier;
      }
      return modifier
    });

    self.dex =  ko.observable(18);
    self.dexModifier =  ko.computed(function(){
         var modifier = getModifier(self.dex());
      if (modifier >= 0){
        modifier = '+ ' + modifier;
      }
      return modifier
    });

    self.con =  ko.observable(18);
    self.conModifier =  ko.computed(function(){
         var modifier = getModifier(self.con());
      if (modifier >= 0){
        modifier = '+ ' + modifier;
      }
      return modifier
    });

    self.int =  ko.observable(18);
    self.intModifier =  ko.computed(function(){
        var modifier = getModifier(self.int());
      if (modifier >= 0){
        modifier = '+ ' + modifier;
      }
      return modifier
    });

    self.wis =  ko.observable(18);
    self.wisModifier =  ko.computed(function(){
        var modifier = getModifier(self.wis());
      if (modifier >= 0){
        modifier = '+ ' + modifier;
      }
      return modifier
    });

    self.cha =  ko.observable(18);
    self.chaModifier =  ko.computed(function(){
        var modifier = getModifier(self.cha());
      if (modifier >= 0){
        modifier = '+ ' + modifier;
      }
      return modifier
    });

    self.clear = function() {
        self.str(18);
        self.dex(18);
        self.con(18);
        self.int(18);
        self.wis(18);
        self.cha(18);
    };

    self.importValues = function(values) {
        self.str(values.str);
        self.dex(values.dex);
        self.con(values.con);
        self.int(values.int);
        self.wis(values.wis);
        self.cha(values.cha);
    };

    self.exportValues = function() {
        return {
            str: self.str(),
            dex: self.dex(),
            con: self.con(),
            int: self.int(),
            wis: self.wis(),
            cha: self.cha(),
        }
    };
};
