import { Hypnos } from 'hypnos';
import { DELAY } from 'charactersheet/constants';

export var DataRepository = {

    settings: {
        ttl: 5,
        repositories: {
            items: {
                url: 'https://adventurerscodex.com/data/v2/SRD/items.min.json',
                skeys: ['core', 'autofill', 'items', 'list'],
            },
            spells: {
                url: 'https://adventurerscodex.com/data/v2/SRD/spells.min.json',
                skeys: ['core', 'autofill', 'spells', 'list'],
            },
            armors: {
                url: 'https://adventurerscodex.com/data/v2/SRD/armor.min.json',
                skeys: ['core', 'autofill', 'armors', 'list'],
            },
            weapons: {
                url: 'https://adventurerscodex.com/data/v2/SRD/weapons.min.json',
                skeys: ['core', 'autofill', 'weapons', 'list'],
            },
            magicItems: {
                url: 'https://adventurerscodex.com/data/v2/SRD/magic_items.min.json',
                skeys: ['core', 'autofill', 'magicItems', 'list'],
            },
            monsters: {
                url: 'https://adventurerscodex.com/data/v2/SRD/monsters.min.json',
                skeys: ['core', 'autofill', 'monsters', 'list'],
            },
            traps: {
                url: 'https://adventurerscodex.com/data/v2/SRD/traps.min.json',
                skeys: ['core', 'autofill', 'traps', 'list'],
            },
            proficiencies: {
                url: 'https://adventurerscodex.com/data/v2/SRD/proficiencies.min.json',
            },
            feats: {
                url: 'https://adventurerscodex.com/data/v2/SRD/feats.min.json',
            },
            features: {
                url: 'https://adventurerscodex.com/data/v2/SRD/features.min.json',
            },
            traits: {
                url: 'https://adventurerscodex.com/data/v2/SRD/traits.min.json',
            },
            nouns: {
                url: 'https://adventurerscodex.com/data/misc/fantasy_nouns.json',
            },
            adjectives: {
                url: 'https://adventurerscodex.com/data/misc/fantasy_adjectives.json',
            },
            backpacks: {
                url: 'https://adventurerscodex.com/data/v2/SRD/backpacks.min.json',
            },
            names: {
                url: 'https://adventurerscodex.com/data/misc/names.json',
            },
        },
    },

    initialize: async () => {
        Object.keys(DataRepository.settings.repositories).forEach((key) => {
            const repository = DataRepository.settings.repositories[key];
            setTimeout(()=> {
                $.ajax({
                    url: repository.url,
                    dataType: 'json',
                    async: true,
                    success: function(data) {
                        DataRepository[key] = data.values;
                        if (key === 'features') {
                            data.values.map(function(item, __, _) {
                                DataRepository[key][item.displayName] = item;
                            });
                        }
                    }
                });
            }, DELAY.LONG);
        });
    },

    /**
     * Convenience function to filter data repository by key
     *
     * @param arrayName: name of array to be queried
     * @param key: the key to filter by
     * @param value: value that key should equal
     */
    filterBy: (name, key, value) => (
        DataRepository[name].filter((item, __, _) => item[key] === value)
    ),

    /**
     * This function returns all of the data of a given type both from
     * the static data repository and from the user's autofill cache.
     */
    listAll: async (name, coreUuid) => {
        const base = Object.keys(DataRepository[name]).map(key => DataRepository[name][key]);
        let entries = [];
        if (!!DataRepository.settings.repositories[name].skeys || !coreUuid) {
            try {
                const response = await Hypnos.client.action({
                    keys: DataRepository.settings.repositories[name].skeys,
                    params: { coreUuid },
                    useCache: true,
                    raw: true,
                    ttl: DataRepository.settings.ttl,
                    many: true,
                });
                entries = response.results;
            } catch(error) {
                console.log(`Error with DR.listAll()`, {error});
            }
        } else {
            // Don't try to pull in additional autofill data for
            // things that don't have any additional data.
        }
        return [...entries, ...base];
    },
};
