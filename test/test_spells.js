"use strict";

describe('Spells', function(){
  describe('Add Item', function() {
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

});