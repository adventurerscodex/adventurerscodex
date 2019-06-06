import 'bin/knockout-bar-progress';

import {
  CoreManager,
    Fixtures,
    Notifications
   } from 'charactersheet/utilities';
import {
    Feat,
    Feature,
    Tracked,
    Trait
} from 'charactersheet/models/character';

import { ACTableComponent } from 'charactersheet/components/table-component';

import { TrackedDetailForm } from './form';

import autoBind from 'auto-bind';
import {flatMap } from 'lodash';
import ko from 'knockout';
import template from './index.html';

class TrackerViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.collapseAllId = '#tracker-pane';
        autoBind(this);
    }

    trackedTypes = [  Feature, Trait, Feat ];

    nameMeta = (tracked) => {
        let metaText = '';
        if (tracked.characterClass) {
            metaText = `${tracked.characterClass()}`;
        }
        if (tracked.level) {
            metaText += ` (Lvl ${tracked.level()})`;
        }
        if (tracked.race) {
            metaText = `${tracked.race()}`;
        }
        return metaText;
    };

    mapToChart = (trackable) => {
        return {
            data: {
                value: parseInt(trackable.max()) - parseInt(trackable.used()),
                maxValue: trackable.max()
            },
            config: {
                strokeWidth: 2,
                trailWidth: 1,
                from: {
                    color: trackable.color
                },
                to: {
                    color: trackable.color
                }

            }
        };};

    resetsOnImg = (trackable) => {
        if(trackable.resetsOn() === 'long') {
            return 'rest-icon long-rest-icon';
        } else if (trackable.resetsOn() === 'short') {
            return 'rest-icon short-rest-icon';
        } else {
            throw 'Unexpected feature resets on string.';
        }
    };

    async refresh () {
        const key = CoreManager.activeCore().uuid();
        const trackables = [];
        let trackedIndex = 0;
        const fetchTrackedEntities = this.trackedTypes.map((type) => type.ps.list({coreUuid: key}));
        const potentialTracked = await Promise.all(fetchTrackedEntities);
        const tracked = flatMap(potentialTracked, (response) => response.objects).filter(this.showTracked);
        let index = 0;
        this.entities(tracked.map(
          (trackable) => {
              trackable.tracked().color = Fixtures.general.colorHexList[index % 12];
              index++;
              return trackable;}
            )
        );
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        const featureChanged = Notifications.feature.changed.add(this.refresh);
        this.subscriptions.push(featureChanged);
        const featChanged = Notifications.feat.changed.add(this.refresh);
        this.subscriptions.push(featChanged);
        const traitChanged = Notifications.trait.changed.add(this.refresh);
        this.subscriptions.push(traitChanged);
        const shortRest = Notifications.events.shortRest.add(this.resetShortRestFeatures);
        this.subscriptions.push(shortRest);
        const longRest = Notifications.events.longRest.add(this.resetLongRestFeatures);
        this.subscriptions.push(longRest);
    }

    resetShortRestFeatures = async () => {
        const updates = this.entities().map(async (entity) => {
            if (entity.tracked().resetsOn() === Fixtures.resting.shortRestEnum) {
                entity.tracked().used(0);
                await entity.ps.save();
                this.replaceInList(entity);
            }
        });
        await Promise.all(updates);
    };

    resetLongRestFeatures = async () => {
        const updates = this.entities().map(async (entity) => {
            entity.tracked().used(0);
            await entity.ps.save();
            this.replaceInList(entity);

        });
        await Promise.all(updates);
    };

    onUsedChange = async (trackedItem) => {
        const response = await trackedItem.ps.save();
        this.replaceInList(response.object);
    }
}

ko.components.register('tracker', {
    viewModel: TrackerViewModel,
    template: template
});
