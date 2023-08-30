import { CoreManager } from 'charactersheet/utilities';
import { Hypnos } from 'hypnos/lib/hypnos';
import { DataRepository, Fixtures } from 'charactersheet/utilities';
import ko from 'knockout';
import template from './index.html';
import logo from 'images/logo-full-circle-icon.png'
import './point-buy';
import './manual';
import './4d6-drop-1';


export class WizardViewModel {

    constructor() {
        CoreManager.setActiveCoreFragment(null);

        this.active = ko.observable('point-buy');
        this.logo = logo;

        this.playerType = ko.observable();

        // Player Fields

        this.characterName = ko.observable();
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

        const items = Object.keys(DataRepository.backpacks).filter(key => (
            key.toLowerCase() === this.backpack().toLowerCase()
        )).flatMap(
            (key) => DataRepository.backpacks[key]
        ).map(item => (
            DataRepository.items[item.name]
        ));

        const { data } = await Hypnos.client.action({
            keys: ['core', 'characters', 'create'],
            params: {
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
                    flaw: '',
                    bond: '',
                    ideal: '',
                    personalityTrait: '',
                },
                profileImage: { type: 'email' },
                health: { maxHitPoints: 10 },
                traits: traits,
                items: items,
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
}


ko.components.register('wizard', {
    viewModel: WizardViewModel,
    template: template
});
