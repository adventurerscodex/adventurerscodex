function DeathSave() {
    var self = this;
    self.ps = PersistenceService.register(DeathSave, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save', 'delete']
    };

    self.characterId = ko.observable(null);
    self.deathSaveSuccess = ko.observable(false);
    self.deathSaveFailure = ko.observable(false);

    self.clear = function() {
        var values = new DeathSave().exportValues();
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

DeathSave.findAllBy = function(characterId) {
    return PersistenceService.findAll(DeathSave).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
