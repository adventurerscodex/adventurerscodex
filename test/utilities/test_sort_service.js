'use strict';

describe('Sort Service', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Static Methods', function() {
        describe('Sort And Filter Boolean', function() {
            it('should ascending sort a given list of objects by a boolean property.', function() {
                var sort = { field: 'dead', direction: 'asc', booleanType: true };

                var sorted_data = SortService.sortAndFilter(SortServiceFixture.data, sort, null);
                sorted_data[0].name().should.equal('Abe');
                var last = sorted_data.length - 1;
                sorted_data[last].name().should.equal('Tiff');
            });
        });
        describe('Sort And Filter Boolean', function() {
            it('should descending sort a given list of objects by a boolean property.', function() {
                var sort = { field: 'dead', direction: 'desc', booleanType: true };

                var sorted_data = SortService.sortAndFilter(SortServiceFixture.data, sort, null);
                sorted_data[0].name().should.equal('Roxanne');
                var last = sorted_data.length - 1;
                sorted_data[last].name().should.equal('Nate');
            });
        });
    });
});
