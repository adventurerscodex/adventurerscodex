"use strict";

describe('NPC Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Instance Methods', function() {
        describe('Clear', function() {
            it('should clear all the sub-model\'s data', function() {
                var npc = new NPC();
                npc.npcId(NPCFixture.npcId);

                var profileSpy = simple.mock(npc.profile, 'clear');
                var appearanceSpy = simple.mock(npc.appearance, 'clear');
                var abilityScoresSpy = simple.mock(npc.abilityScores, 'clear');
                var healthSpy = simple.mock(npc.health, 'clear');
                var treasureSpy = simple.mock(npc.treasure, 'clear');
                var notesSpy = simple.mock(npc.notes, 'clear');

                npc.clear();

                profileSpy.called.should.equal(true);
                appearanceSpy.called.should.equal(true);
                abilityScoresSpy.called.should.equal(true);
                healthSpy.called.should.equal(true);
                treasureSpy.called.should.equal(true);
                notesSpy.called.should.equal(true);

            });
        });

        describe('Import', function() {
            it('should import an object with all the info supplied.', function() {
                var npc = new NPC();
                npc.importValues(NPCFixture);
                npc.npcId().should.equal(NPCFixture.npcId);
                npc.characterId().should.equal(NPCFixture.characterId);
            });
        });

        describe('Export', function() {
            it('should yield an object with all the info supplied.', function() {
                var npc = new NPC();
                npc.importValues(NPCFixture);
                var values = npc.exportValues();

                npc.characterId().should.equal(values.characterId);
                npc.npcId().should.equal(values.npcId);
            });
        });

        describe('Save', function() {
            it('should call the token save.', function() {
                var npc = new NPC();
                var spy = simple.mock(npc.ps, 'save');
                npc.save();
                spy.called.should.equal(true);
            });
        });
    });
    describe('Find All By', function() {
        it('Should return a list of image models matching the given id.', function() {
            //Empty
            simple.mock(PersistenceService, 'findBy').returnWith([new NPC()]);
            NPC.findAllBy('someid').length.should.equal(0);

            //Filled
			simple.mock(PersistenceService, 'findAll').returnWith([new NPC(), new NPC()].map(function(e, i, _) {
				e.characterId('someid');
				return e;
			}));
            NPC.findAllBy('someid').length.should.equal(2);

        });
    });
});
