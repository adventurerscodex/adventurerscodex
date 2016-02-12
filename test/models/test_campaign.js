"use strict";

describe('Campaign Model', function() {
    describe('Clear', function() {
        it('should clear all the data in it', function() {
            var campaign = new Campaign();
            campaign.campaignName(CampaignFixture.campaignName);
            campaign.campaignName().should.equal(CampaignFixture.campaignName);
            campaign.clear();
            campaign.campaignName().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import all the data from a fixture', function() {
            var campaign = new Campaign();
            campaign.importValues(CampaignFixture);
            campaign.campaignName().should.equal(CampaignFixture.campaignName);
        });
    });

    describe('Import', function() {
        it('should import all the data from a fixture', function() {
            var campaign = new Campaign();
            campaign.importValues(CampaignFixture);
            campaign.campaignName().should.equal(CampaignFixture.campaignName);
            campaign.exportValues().campaignName.should.equal(CampaignFixture.campaignName);
        });
    });

    describe('Campaign Summary', function() {
        it('Should display a summary of the campaign', function() {
            var campaign = new Campaign();
            campaign.importValues(CampaignFixture);
            campaign.campaignSummary().should.equal(CampaignFixture.campaignSummary);
        });
    });
});
