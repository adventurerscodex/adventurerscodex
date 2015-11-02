function EnemiesViewModel() {
	var self = this;
	
	self.enemies = ko.observableArray([]);
	self.selectedEnemy = ko.observable(new NPC());
	      
	self.clear = function() {
		self.enemies([]);
	};

	self.importValues = function(values) {
	};

	self.exportValues = function() {
		return {
		};
	};
	
	//UI Methods
	
	self.filteredAndSortedEnemies = ko.computed(function() {
		//TODO
		return self.enemies();
	});
	
	self.addEnemyButton = function() {
		addEnemy();
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
	
	self.addEnemy = function() {
		self.enemies.push(self.selectedEnemy());
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
};
