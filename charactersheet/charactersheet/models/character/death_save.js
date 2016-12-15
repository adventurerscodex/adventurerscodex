function DeathSave() {
    var self = this;
    self.ps = PersistenceService.register(DeathSave, self);
    self.mapping = {
        include: [ 'characterId', 'deathSaveSuccess', 'deathSaveFailure' ]
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
        var css;
        if (self.deathSaveSuccess() === true) {
            css = 'ds-success-full';
        } else if (self.deathSaveSuccess() === false){
            css = 'ds-success-empty';
        }
        return css;
    });

    self.deathSaveFailureIcon = ko.pureComputed(function() {
        var css;
        if (self.deathSaveFailure() === true) {
            css = 'ds-failure-full';
        } else if (self.deathSaveFailure() === false){
            css = 'ds-failure-empty';
        }
        return css;
    });

    self.clear = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        var values = new DeathSave().exportValues();
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

DeathSave.findAllBy = function(characterId) {
    return PersistenceService.findAll(DeathSave).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
