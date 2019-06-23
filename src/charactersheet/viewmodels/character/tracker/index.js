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
import { find, findIndex, flatMap } from 'lodash';
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
        this.entities(tracked);
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
        const trackableIndex = findIndex(this.entities(), (entity) => {
            return entity.uuid === trackable.uuid;});
        const color = Fixtures.general.colorHexList[trackableIndex % 12];
        const trackedItem = ko.utils.unwrapObservable(trackable).tracked();
        return {
            data: {
                value: parseInt(trackedItem.max()) - parseInt(trackedItem.used()),
                maxValue: trackedItem.max()
            },
            config: {
                strokeWidth: 2,
                trailWidth: 1,
                from: {
                    color
                },
                to: {
                    color
                }

            }
        };
    };

    resetsOnImg = (tracked) => {
        if(tracked().resetsOn() === 'long') {
            return 'rest-icon long-rest-icon';
        } else if (tracked().resetsOn() === 'short') {
            return 'rest-icon short-rest-icon';
        } else {
            throw 'Unexpected feature resets on string.';
        }
    };

    onTrackedAdded (trackedItem) {
        if (trackedItem && trackedItem.isTracked()) {
            const tracked = find(this.entities(), (trackable)=> {
                return ko.utils.unwrapObservable(trackedItem).uuid() === ko.utils.unwrapObservable(trackable).uuid();
            });
            if (!tracked) {
                this.addToList(trackedItem);
            }
        }
    }

    onTrackedChanged (trackedItem) {
        if (trackedItem) {
            const tracked = find(this.entities(), (trackable)=> {
                return ko.utils.unwrapObservable(trackedItem).uuid() === ko.utils.unwrapObservable(trackable).uuid();
            });
            if (tracked) {
                if (!ko.utils.unwrapObservable(trackedItem).isTracked()) {
                    // Used to be tracked, is no longer tracked;
                    this.removeFromList(tracked);
                } else {
                    // Used to be tracked, tracked properties changed;
                    this.replaceInList(trackedItem);
                }
            } else if (ko.utils.unwrapObservable(trackedItem).isTracked()) {
                // Was not tracked, is now tracked;
                this.addToList(trackedItem);
            }
        }
    }

    onTrackedDeleted (trackedItem) {
        if (trackedItem) {
            const tracked = find(this.entities(), (trackable)=> {
                return ko.utils.unwrapObservable(trackedItem).uuid() === ko.utils.unwrapObservable(trackable).uuid();
            });
            if (tracked) {
                this.removeFromList(tracked);
            }
        }
    }

    setUpSubscriptions () {
        Notifications.feature.changed.add(this.onTrackedChanged);
        Notifications.feat.changed.add(this.onTrackedChanged);
        Notifications.trait.changed.add(this.onTrackedChanged);

        Notifications.feature.added.add(this.onTrackedAdded);
        Notifications.feat.added.add(this.onTrackedAdded);
        Notifications.trait.added.add(this.onTrackedAdded);

        Notifications.feature.deleted.add(this.onTrackedDeleted);
        Notifications.feat.deleted.add(this.onTrackedDeleted);
        Notifications.trait.deleted.add(this.onTrackedDeleted);

        Notifications.events.shortRest.add(this.resetShortRestFeatures);
        Notifications.events.longRest.add(this.resetLongRestFeatures);
    }

    resetShortRestFeatures = async () => {
        const updates = this.entities().map(async (entity) => {
            if (entity.tracked().resetsOn() === Fixtures.resting.shortRestEnum) {
                if (entity.tracked().used() > 0) {
                    entity.tracked().used(0);
                    await entity.save();
                }
            }
        });
        await Promise.all(updates);
    };

    resetLongRestFeatures = async () => {
        const updates = this.entities().map(async (entity) => {
            if (entity.tracked().used() > 0) {
                entity.tracked().used(0);
                await entity.save();
            }
        });
        await Promise.all(updates);
    };

    onUsedChange = async (trackedItem) => {
        await trackedItem.save();
    }
}

ko.components.register('tracker', {
    viewModel: TrackerViewModel,
    template: template
});
