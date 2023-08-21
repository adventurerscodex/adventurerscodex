const MUNDANE_WEATHER = [
    'Light Wind',
    'Fog',
    'Hail',
    'Heavy Snow',
    'Rain',
    'Sleet',
    'Snow',
    'Cold',
    'Extreme Cold',
    'Extreme Heat',
    'Severe Cold',
    'Severe Heat',
    'Very Hot',
    'Hurricane',
    'Light Wind',
    'Moderate Wind',
    'Severe Wind',
    'Strong Wind',
    'Tornado',
    'Windstorm',
    'Blizzard',
    'Duststorm',
    'Greater Duststorm',
    'Hurricane',
    'Severe Thunderstorm',
    'Snowstorm',
    'Thunderstorm',
];

const ARCANE_WEATHER = [
    'Aberrant Sky',
    'Acid Rain',
    'Animus Blizzard',
    'Arcane Tempest',
    'Blacksleet',
    'Indigo Fog',
    'Dire Hail',
    'Draconic Clouds',
    'Dragon\'s Breath',
    'Ethereal Fog',
    'Expeditious Tailwind',
    'Firestorm',
    'Gatestorm',
    'Ghoststorm',
    'Hallucinatory Stor',
    'Immuring Sleet',
    'Incendiary Clouds',
    'Ghostly Wind',
    'Luminous Clouds',
    'Prismatic Rain',
    'Skyquake',
    'Solid Fog',
    'Spiderweb Clouds',
    'Starfall Hail',
    'Temporal Wind',
    'Thunder Hail',
    'Whispering Wind',
];

const ALL_WEATHER = [...MUNDANE_WEATHER, ...ARCANE_WEATHER];


/**
 * Return a random description of the weather. Optionally this function
 * allows the user to specify weather that is arcane in nature or mundane.
 */
export const randomWeather = (arcane=true) => {
    if (!arcane) {
        return MUNDANE_WEATHER[Math.floor(Math.random() * MUNDANE_WEATHER.length)];
    }
    return ALL_WEATHER[Math.floor(Math.random() * ALL_WEATHER.length)];
}
