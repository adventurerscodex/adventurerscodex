'use strict';

import { Note } from 'charactersheet/models/common/note'

describe('Notes Model', function() {
    describe('Clear', function() {
        it('should clear all the values in notes', function() {
            var p = new Note();
            p.text('Bob');
            p.text().should.equal('Bob');
            p.clear();
            p.text().should.equal('');
        });
    });

    describe('Export', function() {
        it('should yield an object with all the info supplied.', function() {
            var val = {
                text: 'bob is a huge.............butt.'
            };
            var p = new Note();
            p.text(val.text);
            var a = p.exportValues();
            a.text.should.equal(p.text());
        });
    });

    describe('Import', function() {
        it('should import an object with all the info supplied.', function() {
            var val = {
                text: 'bob'
            };
            var p = new Note();
            p.importValues(val);
            p.text().should.equal(val.text);
        });
    });
});

