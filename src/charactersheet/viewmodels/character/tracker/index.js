import 'bin/knockout-bar-progress';

import {
    Feat,
    Feature,
    Trait
} from 'charactersheet/models/character';

import {
    Fixtures,
    Notifications
   } from 'charactersheet/utilities';

import { find, flatMap } from 'lodash';

import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';

import { TrackedDetailForm } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

class TrackerViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.collapseAllId = '#tracker-pane';
        autoBind(this);
    }

    trackedModelTypes = [ Feature, Trait, Feat ];

    async refresh () {
        const fetchTrackedEntities = this.trackedModelTypes.map(
          (type) => type.ps.list({ coreUuid: this.coreKey }));
        const responseList = await Promise.all(fetchTrackedEntities);
        const tracked = flatMap(responseList, (response) => response.objects).filter(this.showTracked);
        let index = 0;
        this.entities(tracked.map(
          (trackable) => {
              trackable.tracked().color = Fixtures.general.colorHexList[index % 12];
              index++;
              return trackable;}
            )
        );
    }

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

    onTrackedChanged (trackedItem) {
        if (trackedItem) {
            const tracked = find(this.entities(), (trackable)=> {
                return ko.utils.unwrapObservable(trackedItem).uuid() === ko.utils.unwrapObservable(trackable).uuid();
            });
            if (tracked) {
                const color = tracked.tracked().color;
                tracked.importValues(trackedItem.exportValues());
                tracked.tracked().color = color;
            }
        }
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        Notifications.feature.changed.add(this.onTrackedChanged);
        Notifications.feat.changed.add(this.onTrackedChanged);
        Notifications.trait.changed.add(this.onTrackedChanged);
        Notifications.events.shortRest.add(this.resetShortRestFeatures);
        Notifications.events.longRest.add(this.resetLongRestFeatures);
    }

    resetShortRestFeatures = async () => {
        const updates = this.entities().map(async (entity) => {
            if (entity.tracked().resetsOn() === Fixtures.resting.shortRestEnum) {
                entity.tracked().used(0);
                await entity.save();
                this.replaceInList(entity);
            }
        });
        await Promise.all(updates);
    };

    resetLongRestFeatures = async () => {
        const updates = this.entities().map(async (entity) => {
            entity.tracked().used(0);
            await entity.save();
            this.replaceInList(entity);

        });
        await Promise.all(updates);
    };

    onUsedChange = async (trackedItem) => {
        const response = await trackedItem.save();
        this.replaceInList(response.object);
    }
}

ko.components.register('tracker', {
    viewModel: TrackerViewModel,
    template: template
});
