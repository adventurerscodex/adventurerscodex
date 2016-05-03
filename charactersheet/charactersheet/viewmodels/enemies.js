function EnemiesViewModel() {
    var self = this;
    
    self.enemies = ko.observableArray([]);
    self.selectedEnemy = ko.observable();
          
    self.clear = function() {
        self.enemies([]);
    };

    self.init = function() {};
    
    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        self.enemies(NPC.findAllBy(key).map(function(e, i, _) {
            e.load();
            return e;
        }));
    };
    
    self.unload = function() {
        self.enemies().forEach(function(e, i, _) {
            e.save();
        });
    };

    //UI Methods
    
    self.filteredAndSortedEnemies = ko.computed(function() {
        //TODO
        return self.enemies();
    });
    
    self.addEnemyButton = function() {
        self.addEnemy(self.selectedEnemy());
    };
    
    self.removeEnemyButton = function(enemy) {
        self.removeEnemy(enemy);
    };
    
    self.removeEnemyRowButton = function(enemy) {
        self.removeEnemy(enemy);
    };
    
    self.editEnemyButton = function(enemy) {
        self.editEnemy(enemy);
    };
    
    self.newEnemyButton = function() {
        self.newEnemy();
    };
    
    //Public Methods
    
    self.addEnemy = function(enemy) {
        enemy.characterId(CharacterManager.activeCharacter().key());
        self.enemies.push(enemy);
    };
    
    self.newEnemy = function() {
        self.selectedEnemy(new NPC());
    };
    
    self.removeEnemy = function(enemy) {
        self.enemies.remove(enemy);
    };
    
    self.editEnemy = function(enemy) {
        self.selectedEnemy(enemy);
    };
}
