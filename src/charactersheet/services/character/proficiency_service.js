import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { OtherStats } from 'charactersheet/models/character/other_stats';
import { Profile } from 'charactersheet/models/character/profile';
import { SharedServiceManager } from '../common/shared_service_manager';
import ko from 'knockout';

export var ProficiencyService = new SharedServiceManager(_ProficiencyService, {});

function _ProficiencyService(configuration) {
    var self = this;

    self.otherStats = ko.observable();
    self.profile = ko.observable();

    self.init = async () => {
        await self.load();
        self.setUpSubscriptions();
    };

    self.load = async (core) => {
        let activeCore;
        if (core) {
            activeCore = core;
        } else {
            activeCore = CoreManager.activeCore();
        }
        if (ko.utils.unwrapObservable(activeCore.type.name) !== 'character') {
            return;
        }
        self.otherStats(new OtherStats());
        self.profile(new Profile());
        await self.otherStats().load({uuid: activeCore.uuid()});
        await self.profile().load({uuid: activeCore.uuid()});

    };
    self.reload = (oldCore, newCore) => {
        self.otherStats(null);
        self.profile(null);
        self.load(newCore);
    };
    self.setUpSubscriptions = () => {
        Notifications.otherstats.changed.add(self.updateOtherStats);
        Notifications.profile.changed.add(self.updateProfile);
        Notifications.coreManager.changing.add(self.reload);
        self.proficiency.subscribe(()=> { Notifications.proficiencyBonus.changed.dispatch(); });
    };

    self.proficiencyModifier = ko.pureComputed(() => {
        if (self.otherStats() && self.otherStats().proficiencyModifier()) {
            return parseInt(self.otherStats().proficiencyModifier()) ? parseInt(self.otherStats().proficiencyModifier()) : 0;
        }
        return 0;
    });

    self.proficiencyBonusByLevel = ko.pureComputed(() => {
        let level = 0;
        if (self.profile() && self.profile().level()) {
            level = parseInt(self.profile().level()) ? parseInt(self.profile().level()) : 0;
        }
        return Math.ceil(level / 4);
    });

    self.proficiency = ko.pureComputed(()=> {
        return 1 + self.proficiencyBonusByLevel() + self.proficiencyModifier();
    });

    self.updateOtherStats = (otherStats) => {
        if (otherStats) {
            self.otherStats().importValues(otherStats.exportValues());
        }
    };

    self.updateProfile = (profile) => {
        if (profile) {
            self.profile().importValues(profile.exportValues());
        }
    };
}
