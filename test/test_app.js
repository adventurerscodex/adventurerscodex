"use strict";

describe('Root View Model', function() {
	describe('Init', function() {
		it('should init the child view models', function() {
			//Character Type
			var vm = new RootViewModel();
			messenger = undefined;
			
			var c = CharacterManager.getKey;
			CharacterManager.getKey = function() {
				return '1234';
			};
			var w = CharacterManager.findBy;
			Character.findBy = function() {
				return [new Character()];
			}

			Should.not.exist(messenger);
			vm.init();
			Should.exist(messenger);
			
			CharacterManager.getKey = c;
			Character.findBy = w;

			//DM Type
			var vm = new RootViewModel();
			messenger = undefined;
			
			var c = CharacterManager.getKey;
			CharacterManager.getKey = function() {
				return '1234';
			};
			var w = CharacterManager.findBy;
			Character.findBy = function() {
				var cha = new Character();
				cha.playerType(PlayerTypes.dmPlayerType);
				return [cha];
			}

			Should.not.exist(messenger);
			vm.init();
			Should.exist(messenger);
			
			CharacterManager.getKey = c;
			Character.findBy = w;
		});
	});	

	describe('Load', function() {
		it('should call load on the child view models', function() {
			//Character Type
// 			var vm = new RootViewModel();
// 			messenger = undefined;
// 			vm.activeTab(undefined);
// 			
// 			Should.not.exist(vm.activeTab());
// 			vm.load();
// 			Should.exist(vm.activeTab());
// 			
// 			CharacterManager.getKey = c;
// 			Character.findBy = w;
// 
// 			//DM Type
// 			var vm = new RootViewModel();
// 			messenger = undefined;
// 			vm.activeTab(undefined);
// 			
// 			Should.not.exist(vm.activeTab());
// 			vm.init();
// 			Should.exist(vm.activeTab());
// 			
// 			CharacterManager.getKey = c;
// 			Character.findBy = w;
		});
	});	



});
