import { Model } from 'hypnos';
import ko from 'knockout';


export class pCard extends Model {
    static __skeys__ = ['core', 'pcard'];

    static FIELDS = [
        'publisherJid',
        'name',
        'armorClass',
        'damage',
        'experience',
        'gold',
        'healthinessStatus',
        'hitDice',
        'hitDiceType',
        'imageUrl',
        'level',
        'magicStatus',
        'maxHitPoints',
        'passiveIntelligence',
        'passivePerception',
        'playerClass',
        'playerName',
        'playerSummary',
        'playerType',
        'publisherJid',
        'race',
        'spellSaveDc',
        'tempHitPoints',
        'trackedStatus',
        // DM Fields
        'exhibit_image'
    ]

    get = (property) => {
        return [this[property]];
    }
}
