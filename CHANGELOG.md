version 2.0.3 (03/16/2019)
* Removes an unused version of font awesome

version 2.0.2 (03/9/2019)
* Updates spells to not require damage type
* Adds banner to account page to help remind users to register their account

version 2.0.1 (03/3/2019)
* Updates skills to support addition of new skills
* Fixes typo in DM screen
* Adds required marker to Armor stealth field

version 2.0.0 (03/2/2019)
* Adds support for cloud syncing
  * Characters and campaigns are now synced between devices for a user's account
  * Adds validation to all fields
* Various fixes and enhancements
* Various UI changes in modules with no modals + chat UI changes.
* Stability enhancements

version 1.6.2 (02/27/2018)
* Adds selenium testing compatibility.
* Fixes dropbox profile pictures not rendering in chat section.
* Fixes an issue with inventory and armor sorting.
* Fixes worth in gold calculation
* Fixes a longstanding issue with temp HP not being calculated properly with damage.
* Moves XMPP websocket to standard port.
* Players now auto-join party when they have only 1 saved party.
* Adds Random Number Generator service
* Applies a temporary workaround for Death Saves corrupting character sheets.

version 1.6.1 (1/19/2018)
* Fix autocomplete issues
* Fixed bug with the environment section in an encounter

version 1.6.0 (1/03/2018)
* App now stretches the whole screen on larger devices
* Import button is now disabled if there is no character selected to import
* Enhancement to death save and the health status line
* Added delete button on the character picker screen
* Notes section improvements
* Deleting a character no longer changes you to the first character on the list
* Various UI fixes for DM tools on mobile
* Remove select2 and add jquery auto-complete
* Move menu to the nav bar
* Implemented point buy system in the wizard
* Current character or campaign and tab is saved the URL so that those are loaded when the page is refreshed
* Various UI improvements and performance enhancements

version 1.5.3 (12/27/2017)
* fixes an issue with the latest version not working on older browser versions

version 1.5.2 (12/19/2017)
* Upgrades project build/deploy to webpack
* Drastically simplifies build process
* Fixes a number of internal code issues
* Adds support for continous deployment
* Adds support for testing environment and environment dependent variables
* Fixes an issue where deleting encounters would not not delete their data or their children.
* Fixes issue with deleting last note.
* Adds Dropbox Image support to all image fields.
* Adds migration to fix issue with monster ability scores causing slow performance.
* Fixes an issue with Monster Ability Scores continually saving new data.
* Fixes support page link
* Improves overall app load time and initial run performance.
* Adds version info to footer.

version 1.5.1 (8/01/2017)
* Adds subraces to races dropdown
* Fixes issue with switching characters
* Adds pre-population of traits based on selection of race in wizard
* Fixes issue with ellipse pictures in the picker
* Improves encounter switching speed
* Fixes issue where notes do not save when switching notes
* Adds new XMPP connection status indicator to player image
* Dropbox export is no longer shown to non-logged in users
* Adds status line for what party you're connected to
* Adds new tight-inner panel class that saves some space with tables
* Add populate backpacks
* Increases encoutner collapse button hit-box size
* Adds notifications service
* Characters are no longer dead upon creation
* Show party content offline
* Adds 4 minute XMPP ping to keep connection alive
* Remove ko from hp bar
* Adds account conflict detection
* Reduces notification spam
* Add death save success toastr

version 1.5.0 (7/04/2017)
* Adds new notifications for connection errors.
* Adds link detection to chat messages.
* Adds new section for DM Notes
* Adds dropbox direct link detection for all link fields.
* Adds new maps/images encounter section.
* Adds new Push To Chat functionality to all Maps/Images and Enviroments.
* Adds new section for campaign maps.
* Fixes a bug where chat rooms might not be saved.
* Adds new death saves failure notification.
* Adds support for custom skills.
* Adds new profile picture picker.
* Adds new glow to player picture when inspired.
* Fixes an issue with chat room case sensitivity.
* Adds new exhibit funcitonality for maps, images, and environments.

version 1.4.3 (6/11/2017)
* Fixes bug with saving notes

version 1.4.2 (6/11/2017)
* Changes where the navbar links take you
* Fixes bug with private chats
* Removes google analytics code
* Fixes bug where chat history was not purged when you left a party
* Fixes issue where the character/campaign name was autocorrected
* Updates handling of error messages
* Fixes issue with blank message in chat

version 1.4.1 (5/31/2017)

* Fixes issue with some player images now displaying correctly.
* Removes malfuctioning room URLs (for now).
* Fixes favicon.

version 1.4.0 (5/30/2017)

* Updates logo
* Adds prepopulation for NPC Races, Classs
* Adds prepopulation for Features and Traits
* Fixes a bug with gold weight calculations
* Adds new Party Collaboration Tools
 * Adds new Party Manager UI that allows users to create/manage their parties.
 * Adds a new chat for all members of a party as well as optional private chats for member(s).
  * Adds new "Save to Notes" feature for chat messages.
 * Adds new Party Dashboard for the DM which allows them to see their party member's stats.
 * Adds a new Party Status Line for DMs which allows them to gauge the overall status of their party.
* Updates Gravatar to use HTTPS.
* Fixes a few encoding errors with HTML entities in headers
* Adds new Save to Dropbox functionality.
* Updates Alert system to use a new, swanky looking system.
* Fixes broken links
* Adds new character switcher that is displayed on first load.
* Adds new Account signin/creation links
* Adds new Patreon Link
* Updates contributer list.

version 1.3.0 (2/21/2017)

####Player Tools####

* New tables and modals for Features, Feats, Traits, Proficiencies, and Languages
* New handling of tracked items
* Improved messaging library, toastr
* Add inspired to status line
* Add popovers for auto-calculations
* Add passive scores to skills table
* Add always prepared to spells modal
* Add to hit modifier adjustment
* Add short and long rest icons to spell slots module

####DM Tools####

* Add magic damage types to options list for weapons
* Pre-population for monsters
* Add DM Screen

version 1.2.0 (12/14/2016)

####Player Tools####

Autocomplete:

  * Armor
  * Weapons
  * Magic Items
  * Race (Names only)
  * Class (Names only)
  * Alignment

Preview Cards:

  * Spells
  * Magic Items
  * Inventory
  * Armor
  * Weapons

Auto Calculation:

  * Weapon Range
  * Total weight for gold
  * Total spells

Notes module:

  * Add multiple notes nesting
  * Add markdown support

Spells module:

  * Add spell status
  * Cantrip removes prepared checkbox

Status line:

  * Add total weight

UI:

  * Death saves redesign
  * Image URL redesign
  * New short and long rest icons
  * Add short and long rest icons to tracking table
  * Add badges for magic weapons and armor

General:

  * Spell slots status bar sized dynamically by max uses

####DM Tools####

  * Add new campaigns for DMs
  * Add Campaign image
  * Overview tab
    * Setting
    * Days since campaign started
    * Notes
  * Encounters tab
    * Add remove encounters (Nested up to 5 levels)
      Encounter types:
        * Add types to tailor encounter
        * Environment
        * Points of interest
        * NPC
        * Read aloud text (Boxed text)
        * Monsters
        * Treasure
  * Export campaign

version 1.1.1 (10/04/2016)
* fixes issue with Proficiency Calculations not updating or providing invalid modifiers.

version 1.1.0 (10/02/2016)
* Adds proficiency auto-calculation
* Spell slots reset on short/long rest
* Removes modifier label on skills and savings throws
* Minor text fixes
* Added footer
* Fixed license
* Adds jQuery autocomplete binding
* Add migration engine
* Add KO binding for modals
* Add new ability score step for wizard
* Adds new proficiency types
* Add data cleanup
* Spells auto complete
* Items auto complete

version 1.0.1 (09/10/2016)
* Fixed issue with spell attack bonuses
* Minor text fixes
* Fixed issue with skills modal reloading on enter key press
* **Huge!** Hotkey now works on actions toolbar

version 1.0 (08/27/2016)
* Significant UI Refresh
  * All new design for charactersheet and intro wizard.
* The triumphant return of the quantity field to the weapons table.
* Fixes criteria for Daily Features resetting on short rest
* Fixes issue with stepper UI.
* Fixes issue where Daily Features colors would repeat.
* Minor Text Fixes
* Increases application testing

version 0.0.12 (07/05/2016)
* **Huge!** Fixes an issue where importing a character would lose data
* **Huge!** Fixes an issue where exporting a character would lose data
* Fixed the size of huge images on large screens
* Adds a helper to empty tables
* Made resting notification messages more helpful
* Adds Google Analytics
* Various code fixes
* Added a shiny new icon in the navbar

version 0.0.11 (06/19/2016)
* Changes location of and adds remaining total weight calculations to relevant modules.
* Fix testing/installation issue on Windows
* App-Wide UI redesign (it looks nice now)
* Fixed a bug with exporting characters
* reduced the size of character data
* fixed issue with Weapon modifiers
* fixed issue with hotkeys not firing

version 0.0.10 (6/7/2016)

* Adds icons for treasure and fixes max size on larger devices
* Fixes horizontal scrolling
* Updates the Health Module UI
* Adds lots of tests and code related improvements.
* Adds "Import from Dropbox"


version 0.0.9 (5/19/2016)

* Adds action toolbar
* fixed an issue with character creation
* adds visualization to Daily Features Bar
* Add hover over color red to remove icons
* various code improvements
* various enhancements for Tablet users


version 0.0.8 (5/4/2016)

* updated iconography
* fixes styling on some hitdice elements
* various UI and performance tweaks
* fixes issues importing the same characters more than once


version 0.0.7 (4/21/2016)

* adds new icons for tabs
* adds new power user shortcuts
* adds missing spell duration option
* various other icon improvements
* various code fixes


version 0.0.6 (4/6/2016)

* various bug fixes and improvements
* fixes hit dice icon
* fixes issue with sorting
* fixes issue with saving armor and stats
* cleaner UI for cantrips
* reset button for spell slots


version 0.0.5 (3/23/2016)

* add magic items module
* rename columns armor module
* fixes boolean sorting
* fixes hit dice bug
* various bug fixes and code improvements

version 0.0.4 (3/6/2016)

* various UI updates
* adds select2 tags
* adds weapon "to-hit" calculations
* various bug fixes
* fixes an issue where view was not scrollable after making a new character
* adds currency types for item cost


version 0.0.3.1 (3/1/2016)

* fixed critical bug for hit dice type preventing users from using the application in some cases
* fixed character switching bug
* fixed savings throws bug


version 0.0.3 (2/24/2016)

* added select2 bindings to dropdowns
* implemented select2 to option dropdowns
* chat improvements (profile pic)
* added death saves
* added hit dice type
* added boolean sorting (i.e. spell slots)
* spells slots now editable
* added passive wisdom
* added total of prepared spells
* various bug fixes

version 0.0.2 (2/9/2016)

* drag and drop profile pictures with option gravatar config
* improved character sheet layout
* added character sheet wizard
* added prepared spells checkbox to spell module
* added a field for diety in profile module
* dm can now see character hp, ac, name and pic
* added weapon and armor module
* export data now well formatted
* various bug fixes


