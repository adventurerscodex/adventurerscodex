function DeathSave() {
    var self = this;
    self.ps = PersistenceService.register(DeathSave, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save', 'delete',
                'mapping']
    };

    self.characterId = ko.observable(null);
    self.deathSaveSuccess = ko.observable(false);
    self.deathSaveFailure = ko.observable(false);

    self.deathSaveSuccessHandler = function() {
        if(self.deathSaveSuccess() === true) {
            self.deathSaveSuccess(false);
        } else if (self.deathSaveSuccess() === false) {
            self.deathSaveSuccess(true);
        }
    };

    self.deathSaveFailureHandler = function() {
        if(self.deathSaveFailure() === true) {
            self.deathSaveFailure(false);
        } else if (self.deathSaveFailure() === false) {
            self.deathSaveFailure(true);
        }
    };

    self.deathSaveSuccessIcon = ko.pureComputed(function() {
        if (self.deathSaveSuccess() === true) {
            var css = 'ds-success-full';
        } else if (self.deathSaveSuccess() === false){
            var css = 'ds-success-empty';
        }
        return css;
    });

    self.deathSaveFailureIcon = ko.pureComputed(function() {
        if (self.deathSaveFailure() === true) {
            var css = 'ds-failure-full';
        } else if (self.deathSaveFailure() === false){
            var css = 'ds-failure-empty';
        }
        return css;
    });

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
