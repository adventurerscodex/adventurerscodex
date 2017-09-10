describe('Campaign', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save campaign', function() {
            var campaign = new Campaign();
            var campaignSpy = simple.mock(campaign.ps, 'save');

            campaign.save();
            campaignSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete campaign', function() {
            var campaign = new Campaign();
            var campaignSpy = simple.mock(campaign.ps, 'delete');

            campaign.delete();
            campaignSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear campaign', function() {
            var campaign = new Campaign();
            campaign.playerName('blah');

            campaign.playerName().should.equal('blah');
            campaign.clear();
            Should.not.exist(campaign.playerName());
        });
    });

    describe('Import', function() {
        it('should import campaign', function() {
            var campaign = new Campaign();

            Should.not.exist(campaign.playerName());
            campaign.importValues({"playerName": 'blah'});
            campaign.playerName().should.equal('blah');
        });
    });

    describe('Export', function() {
        it('should export campaign', function() {
            var campaign = new Campaign();
            campaign.playerName('blah');

            campaign.playerName().should.equal('blah');
            var exported = campaign.exportValues();
            exported.playerName.should.equal('blah');
        });
    });

    describe('Summary', function() {
        it('should return the complete summary label', function() {
            var campaign = new Campaign();
            campaign.name('Guardians of the Galaxy');
            campaign.playerName('Peter Quill');

            var summary = campaign.summary();
            summary.should.equal('Guardians of the Galaxy: A story by Peter Quill');
        });
        it('should return the default summary label', function() {
            var campaign = new Campaign();

            var summary = campaign.summary();
            summary.should.equal('A long long time ago...');
        });
    });

});
