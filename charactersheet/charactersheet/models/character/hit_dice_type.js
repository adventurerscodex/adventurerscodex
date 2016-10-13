function HitDiceType() {
    var self = this;
    self.ps = PersistenceService.register(HitDiceType, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save',
                'mapping', 'hitDiceOptions']
    };

    self.characterId = ko.observable(null);
    self.hitDiceType = ko.observable('');
    self.hitDiceOptions = ko.observableArray(Fixtures.hitDiceType.hitDiceOptions);

    self.clear = function() {
        var values = new HitDiceType().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}

HitDiceType.findAllBy = function(characterId) {
    return PersistenceService.findAll(HitDiceType).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
