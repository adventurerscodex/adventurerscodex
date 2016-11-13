'use strict';

describe('NotesSection', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Clear', function() {
        it('should clear notes', function() {
            var notes = new NotesSection();
            notes.notes('blah');

            notes.notes().should.equal('blah');
            notes.clear();
            notes.notes().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import notes', function() {
            var notes = new NotesSection();

            notes.notes().should.equal('');
            notes.importValues({"notes": 'blah'});
            notes.notes().should.equal('blah');
        });
    });

    describe('Import', function() {
        it('should import notes', function() {
            var notes = new NotesSection();
            notes.notes('blah');

            notes.notes().should.equal('blah');
            var exported = notes.exportValues();
            exported.notes.should.equal('blah');
        });
    });
});
