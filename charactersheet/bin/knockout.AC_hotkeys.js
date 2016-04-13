ko.bindingHandlers.acHotkeys = {
    init: function(element, valueAccessor, allBindings, vm) {
        ko.utils.registerEventHandler(element, "keydown", function(event) {
          var type = event.target.type;
          var trigger = (event.target.id === '') &&
            (type !== 'number' && type !== 'text' && type !== 'textarea');
          if(trigger){
            var char = String.fromCharCode(event.which);
            var cb = self.hotkeys[char];
            if(typeof cb === 'function'){
              cb();
            }
          }
          return true;
            // if (event.keyCode === 13) {
            //     ko.utils.triggerEvent(element, "change");
            //     valueAccessor().call(vm, vm); //set "this" to the data and also pass it as first arg, in case function has "this" bound
            // }
            // return true;
        });
    }
};

ko.hotkeys = {
  1: function() {
    self.activateProfileTab();
  },
  2: function() {
    self.activateStatsTab();
  },
  3: function() {
    self.activateSkillsTab();
  },
  4: function() {
    self.activateSpellsTab();
  },
  5: function() {
    self.activateEquipmentTab();
  },
  6: function() {
    self.activateInventoryTab();
  },
  7: function() {
    self.activateNotesTab();
  },
  8: function() {
    if(self.partyTabStatus() !== 'hidden'){
      self.activatePartyTab();
    }
  }
};
