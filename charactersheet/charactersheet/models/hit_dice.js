function HitDice() {
    var self = this;
    self.ps = PersistenceService.register(HitDice, self);

    self.characterId = ko.observable(null);
    self.hitDiceUsed = ko.observable(false);

    self.clear = function() {
        self.hitDiceUsed(false);
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.hitDiceUsed(values.hitDiceUsed);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            hitDiceUsed: self.hitDiceUsed()
        };
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.toggleHitDice = function() {
        self.hitDiceUsed(!self.hitDiceUsed());
        self.save();
    };

    self.hitDiceIcon = ko.pureComputed(function() {
        var css = 'dice-full';
        if (self.hitDiceUsed()) {
            css = 'dice-empty';
        }
        return css;
    });
}

HitDice.findAllBy = function(characterId) {
    return PersistenceService.findAll(HitDice).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
