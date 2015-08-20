# Possible Modules
- Modules have 3 things at least:
	1. Local storage persistance
	2. Import from file
	3. Export to file

# Simple Modules
- These modules only require local storage. No web access.

## Backpack - Simple
- A place for players to store their items 
	- It has a name field, an a description (free form)
	- Maybe a weight?
- The backpack keeps track of their overburdened status?
- All local storage (w/ import/export)

## Notes - Simple
- A place for players to put free form notes (html escaped)
- All local storage (w/ import/export)

## Profile - Simple
- Player name/Character name
- Level
- Exp
- etc.
- All local storage (w/ import/export)

## Stats - Simple
- Health
- Poisoned? Deaf? Etc.

## Spells - Simple
- What spells do they have? What level are they?
- Spell slots per level (total/used)

# More complex stuff (websocketsc)
- My idea is that it would require a few things:
	- Websockets
	- A server
	- A session for players
- Basically the DM would start a game and would be given a link. They would give that link to their players and the players would enter a room (connected by websocketsc). 
- At any time, the players app can ask the DM for a refresh of the data. All their synced information will be lost (not the simple modules though) and their combat logs/players list/etc would be reloaded.

## Players - Medium
- The DM would be able to see the present players and they would all see each other. 

## Enemies - Medium
- The DM would enter some enemies and their stats. 
- The players would see the enemies, but not the stats.
- If an enemy or player's health hits zero we could put an X for dead.

## Initiative - Medium
- This module keeps track of the players and their respective initiative. 
- At the beginning of each combat a player would enter their initiative (once the DM prompts it) and the players would be sorted accordingly.
- Their would be a next button for the DM to keep track of who's the active player (optional).

## Combat Tracker - Complex
- Once the players are in a room together, their app would ask the DM for the combat log. The DM's app would respond with the updated log (if any) and everyone would be synced. Now when a player enters something in the combat log, their app would tell the others in the room. The DM's app  would keep track of all that information.
- Basically it allows for a chronological list of events in a given combat. 
- It could be cleared and saved.
- Each 'event' contains a player who did it (or world event for others) and what they did as free form text. 