"use strict";

describe('Spells', function(){
  describe('Add Spell', function() {
    it('should add a new spell to the spellbook', function() {
      var book = new Spellbook();
      book.clear();
      book.spellbook().length.should.equal(0);
      book.addSpell();
      book.spellbook().length.should.equal(1);
    });
  });

  describe('Remove Item', function() {
    it('should remove a item from the spellbook', function() {
      var book = new Spellbook();
      book.clear();
      book.spellbook().length.should.equal(0);
      book.addSpell();
      book.spellbook().length.should.equal(1);
      book.removeSpell(book.spellbook().pop());
      book.spellbook().length.should.equal(0);
    });
  });

  describe('Clear', function() {
    it('should clear all the values in the spellbook', function() {
      var book = new Spellbook();
      var spell = [new Spell()];
      book.spellbook(spell);
      book.spellbook().should.equal(spell);
      book.clear();
      book.spellbook().length.should.equal(0);
    });
  });

  describe('Export', function() {
    it('should return an object with the data given', function() {
      var book = new Spellbook();
      book.clear();
      book.spellbook().length.should.equal(0);
      book.addSpell(new Spell());
      book.spellbook().length.should.equal(1);
      var exportValues = book.exportValues();
      exportValues.spellbook.length.should.equal(book.spellbook().length);
    });
  });

  describe('Import', function() {
    it('should import an object with the data given', function() {
      var book = new Spellbook();
      book.clear();
      book.spellbook().length.should.equal(0);
      var spell = [{
        spellName: '',
        spellType: '',
        spellDmg: '',
        spellSchool: '',
        spellLevel: 1,
        spellDescription: '',
        spellCastingTime: '',
        spellRange: '',
        spellComponents: '',
        spellDuration: ''
      }];
      book.importValues({ spellbook: spell });
      book.spellbook().length.should.equal(spell.length);
    });
  });

});