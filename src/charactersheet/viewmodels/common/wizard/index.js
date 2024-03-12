import autoBind from 'auto-bind';
import 'bin/popover_bind';
import { CoreManager } from 'charactersheet/utilities';
import { Hypnos } from 'hypnos/lib/hypnos';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { DataRepository, Fixtures } from 'charactersheet/utilities';
import { UserServiceManager } from 'charactersheet/services/common';
import { generate_name } from 'charactersheet/services/common';
import ko from 'knockout';
import template from './index.html';
import logo from 'images/logo-full-circle-icon.png';
import './point-buy';
import './manual';
import './4d6-drop-1';


export class WizardViewModel extends ViewModel {

    constructor() {
        CoreManager.setActiveCoreFragment(null);
        super();
        autoBind(this);

        this.active = ko.observable('point-buy');
        this.logo = logo;

        this.playerType = ko.observable();

        this.isLoading = ko.observable(false);
        this.elaboration = ko.observable();
        this.remainingElaborations = ko.observable(false);
        this.userIsPatron = ko.observable(false);

        // Player Fields

        this.characterName = ko.observable();
        this.playerName = ko.observable();
        this.race = ko.observable();
        this.characterClass = ko.observable();
        this.backpack = ko.observable();
        this.level = ko.observable(1);
        this.alignment = ko.observable();
        this.deity = ko.observable();
        this.gender = ko.observable();
        this.age = ko.observable();
        this.background = ko.observable();
        this.experience = ko.observable();

        this.strength = ko.observable(8);
        this.dexterity = ko.observable(8);
        this.constitution = ko.observable(8);
        this.intelligence = ko.observable(8);
        this.wisdom = ko.observable(8);
        this.charisma = ko.observable(8);

        this.backstory = ko.observable();
        this.personalityTraits = ko.observable();
        this.ideals = ko.observable();
        this.flaws = ko.observable();
        this.bonds = ko.observable();

        this.scores = ko.observableArray([
            {
                name: 'Strength',
                shortName: 'STR',
                value: this.strength,
            },
            {
                name: 'Dexterity',
                shortName: 'DEX',
                value: this.dexterity,
            },
            {
                name: 'Constitution',
                shortName: 'CON',
                value: this.constitution,
            },
            {
                name: 'Intelligence',
                shortName: 'INT',
                value: this.intelligence,
            },
            {
                name: 'Wisdom',
                shortName: 'WIS',
                value: this.wisdom,
            },
            {
                name: 'Charisma',
                shortName: 'CHA',
                value: this.charisma,
            }
        ]);

        // DM Fields

        this.campaignName = ko.observable();
        this.playerName = ko.observable();

        //Static Data

        this.raceOptions = Fixtures.profile.raceOptions;
        this.classOptions = Fixtures.profile.classOptions;
        this.alignmentOptions = Fixtures.profile.alignmentOptions;
        this.backgroundOptions = Fixtures.profile.backgroundOptions;
        this.backpackOptions = Fixtures.wizardProfile.backpackOptions;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        this.subscriptions.push(
            Notifications.user.exists.add(this.userDidChange)
        );
        this.userDidChange();
    }

    generateRandomName() {
        const firstName = generate_name('firstName');
        const lastName = generate_name('lastName');
        this.characterName(`${firstName} ${lastName}`);
    }

    async elaborate() {
        this.isLoading(true);

        try {
            const response = await Hypnos.client.action({
                keys: ['elaborate', 'characters', 'profile', 'create'],
                params: {
                    name: this.characterName(),
                    race: this.race(),
                    characterClass: this.characterClass(),
                    alignment: this.alignment(),
                    age: this.age(),
                    gender: this.gender(),
                    background: this.background(),
                    flaws: this.flaws(),
                    bonds: this.bonds(),
                    ideals: this.ideals(),
                    personalityTraits: this.personalityTraits(),
                    backstory: this.backstory(),
                },
            });
            this.elaboration(response.data);
        } catch(err) {
            this.elaboration({});
        }
        this.isLoading(false);

        // Refresh the user's stats.
        UserServiceManager.sharedService().getAccount();
    }

    hasContext = ko.pureComputed(() => (
        ko.unwrap(this.characterName) && ko.unwrap(this.race) && ko.unwrap(this.characterClass)
    ));

    hasFieldsToGenerate = ko.pureComputed(() => !(
        ko.unwrap(this.alignment) && ko.unwrap(this.gender) && ko.unwrap(this.background)
        && ko.unwrap(this.ideals) && ko.unwrap(this.flaws) && ko.unwrap(this.bonds)
        && ko.unwrap(this.personalityTraits) && ko.unwrap(this.backstory)
    ));

    userHasReachedLimits = ko.pureComputed(() => (
        this.remainingElaborations() === 0
    ));

    remaining = ko.pureComputed(() => (
        `You have ${this.remainingElaborations()} remaining uses this month.`
    ));

    useElaboration() {
        this.background(this.elaboration().background);
        this.alignment(this.elaboration().alignment);
        this.gender(this.elaboration().gender);
        this.age(this.elaboration().age);
        this.personalityTraits(this.elaboration().personalityTraits);
        this.ideals(this.elaboration().ideals);
        this.flaws(this.elaboration().flaws);
        this.bonds(this.elaboration().bonds);
        this.backstory(`${this.elaboration().backstory}\n\n${this.elaboration().goals}`);
        this.resetElaboration();
    }

    resetElaboration() {
        this.elaboration(null);
    }

    async save() {
        if (this.playerType() == 'character') {
            await this.saveCharacter();
        } else {
            await this.saveCampaign();
        }
    }

    async saveCharacter() {
        const traits = Object.keys(DataRepository.traits).filter(key => (
            DataRepository.traits[key].race.toLowerCase() === this.race().toLowerCase()
        )).map((key) => ({ ...DataRepository.traits[key], tracked: null }));

        const features = DataRepository.features.filter(feature => (
            feature.characterClass.toLowerCase() === this.characterClass().toLowerCase()
        )).filter(feature => (
            parseInt(feature.level) <= parseInt(this.level())
        )).map(feature => ({ ...feature, tracked: null }));

        const items = Object.keys(DataRepository.backpacks).filter(key => (
            key.toLowerCase() === this.backpack().toLowerCase()
        )).flatMap(
            (key) => DataRepository.backpacks[key]
        ).map(item => (
            DataRepository.items[item.name]
        ));

        const notes = (
            this.backstory()
            ? [{ title: 'Backstory', contents: this.backstory() }]
            : []
        );

        const { data } = await Hypnos.client.action({
            keys: ['core', 'characters', 'create'],
            params: {
                playerName: this.playerName(),
                profile: {
                    characterName: this.characterName(),
                    level: this.level(),
                    age: this.age(),
                    deity: this.deity(),
                    gender: this.gender(),
                    experience: this.experience(),
                    race: this.race(),
                    characterClass: this.characterClass(),
                    alignment: this.alignment(),
                },
                abilityScores: ko.mapping.toJS(this.scores()),
                background: {
                    name: this.background(),
                    flaw: this.flaws(),
                    bond: this.bonds(),
                    ideal: this.ideals(),
                    personalityTrait: this.personalityTraits(),
                },
                profileImage: { type: 'email' },
                health: { maxHitPoints: 10 },
                traits: traits,
                features: features,
                items: items,
                notes: notes,
            }
        });
        CoreManager.changeCore(data.uuid);
    }

    async saveCampaign() {
        const { data } = await Hypnos.client.action({
            keys: ['core', 'dms', 'create'],
            params: {
                campaign: {
                    name: this.campaignName(),
                },
                playerName: this.playerName(),
                profileImage: { type: 'email' },
            },
        });
        CoreManager.changeCore(data.uuid);
    }

    // Events

    userDidChange() {
        const user = UserServiceManager.sharedService().user();
        if (user) {
            this.userIsPatron(user.isActivePatron);
            this.remainingElaborations(user.remainingElaborations);
        }
    }
}


ko.components.register('wizard', {
    viewModel: WizardViewModel,
    template: template
});
