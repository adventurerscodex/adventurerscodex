'use strict';

describe('Chat Message Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new ChatMessage();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var ft = new ChatMessage();
            var e = {
                text: 'sup'
            };
            ft.text().should.equal('');
            ft.importValues(e);
            ft.text().should.equal(e.text);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new ChatMessage();
            ft.text('sup');
            ft.text().should.equal('sup');
            var e = ft.exportValues();
            ft.text().should.equal(e.text);
        });
    });

    describe('Message', function() {
        it('should trim the text.', function() {
            var ft = new ChatMessage();
            ft.text('sup');
            ft.from('Bob');
            ft.text().should.equal('sup');
            ft.from().should.equal('Bob');

            ft.message().should.equal('Bob: sup');
        });
    });

    describe('Delete', function() {
        it('should delete the objects.', function() {
            var ft = new ChatMessage();
            var deleted = false;
            ft.ps.delete = function() { deleted = true; };

            deleted.should.equal(false);
            ft.delete();
            deleted.should.equal(true);
        });
    });

    describe('Find All', function() {
        it('should find all of the values in the db.', function() {
            var key = '1234';
            simple.mock(PersistenceService, 'findAll').returnWith([new ChatMessage(), new ChatMessage()]);
            var r = ChatMessage.findAllBy(key);
            r.length.should.equal(0);


            simple.mock(PersistenceService, 'findAll').returnWith([new ChatMessage(), new ChatMessage()].map(function(e, i, _) {
                e.characterId(key);
                return e;
            }));
            r = ChatMessage.findAllBy(key);
            r.length.should.equal(2);
        });
    });
});
