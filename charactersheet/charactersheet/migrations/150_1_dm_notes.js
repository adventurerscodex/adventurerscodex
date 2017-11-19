import { PersistenceService } from 'charactersheet/services/common/persistence_service';

// import { Note } from 'charactersheet/models'

/**
 * If a Campaign had Notes, they will be migrated to the new DM Notes tab.
 */
export var migration_150_1_dm_notes = {
    name: 'Migrate Campaign Notes to new DM Notes',
    version: '1.5.0',
    migration: function() {
        var campaigns = PersistenceService.findAllObjs('Campaign');
        campaigns.forEach(function(element, idx, _) {
            var characterId = element.data.characterId;
            if (element.data.notes && element.data.notes !== '') {
                var note = new Note();
                note.characterId(characterId);
                note.text('Archived Notes\n\n' + element.data.notes);
                note.save();
            }
        });
    }
};
