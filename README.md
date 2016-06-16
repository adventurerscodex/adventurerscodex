<div style="background-color:#2c3e50;">
<h1 style="text-align: center; margin-top: 0.0em; margin-bottom: 0.5em; padding-bottom:0.3em; font-size: 29px; font-family: HelveticaNeue-Bold; page-break-inside: avoid; page-break-after: avoid; color: rgb(51, 51, 51); font-style: normal; color:white;">
<center><img class="tl-email-image" data-id="455053" height="100" src="http://gallery.tinyletterapp.com/c0e1ae00b92e2d758f243a5a1eecefd66836c060/images/3cd93e95-2382-429d-b599-b6368f2ca9cf.png" style="padding-top: 10px; width: 100px; max-width: 100px;" width="100" /></center>
Welcome to Adventurer&rsquo;s&nbsp;Codex <sup style="color:orange;">Beta!</sup></h1>
</div>

[![Build Badge](https://travis-ci.org/adventurerscodex/adventurerscodex.github.io.svg)](https://travis-ci.org/adventurerscodex/adventurerscodex.github.io)
[![Coverage Status](https://coveralls.io/repos/github/adventurerscodex/adventurerscodex.github.io/badge.svg?branch=develop)](https://coveralls.io/github/adventurerscodex/adventurerscodex.github.io?branch=develop)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/Sonictherocketman/adventurerscodex)

A tool to help D&D 5e players keep their ducks in a row.


What is it?
===========

Charactersheet is a project that aims to take the friction out of some aspects of playing D&D while not removing the classic elements of the game. Unlike other tools, this project is not aiming to automate elements like rolling dice, or leveling up. We've found that tools trying to make the game simpler, actually make it harder for players by forcing them to play by-the-book. There's usually no regard for house rules.

Charactersheet's goal is to make the game more immersive, and bring it into the 21st century.


Features
========

BETA NOTICE: Not all features are implemented, but they will be soon!

Adventurer’s Codex is a tool to help you as players or as the Dungeon Master keep track of your game and characters. The best part is that as more of your party uses it, the app gets even better! But remember, you don’t need the whole group to use it for you to reap the benefits!


For players
-----------

Access to your character’s stats, skills, spells, and more in an easy, intuitive interface.

Quickly find the information you need with searchable, filterable tables making it easier to find and use those spur of the moment abilites.

Make multiple characters and play them at the same time! Do you control a host of minions, or henchmen? Give them each a character sheet and bring them to life!

Leveling up can be complex, and there's a lot of things to update. We provide some recommendations when you reach the next level to help you get past the pesky numbers and back to the game.

Need a long rest? We can help with that too. With our auto-long-rest feature, you’ll be sure to get all the benefits of a good night sleep.


For DMs
-------

Keep track of your campaign easily with rich text, searchable notes.

Prepare enemies and terrain ahead of time, and be ready for that encounter.

Do you have an important NPC that you want to bring to life? Make them a character sheet and get all of the advantages of Adventurer’s Codex that your players do.


For Parties
-----------

Once more than one of your party members starts using Adventurer’s Codex, then you’ll really start to see the benefits.

See what you’re up against! The DM can present pictures of enemies, and terrain to players. This helps the DM paint a better picture of events so the players will be able to better visualize their situation.

Have you ever been betrayed by a player not respecting what their character shouldn’t know? We’ve all been there. It’s hard to separate player-knowledge from character-knowledge, so we’ve made something to help! With private chat, you can talk directly to the player you want to talk with, and be sure there’ll be no eavesdropping.

Certain actions only make sense during certain times of day. With our day-night feature, you’ll always know the current time and weather of the land. The DM can configure the precise time, day, and weather instantly so that the players will always be aware of the changing seasons.



Where's my data stored?
=======================

Here's the cool part: all your data is stored on your local machine! There's no server that's keeping a log of your characters, your adventures, or your party!

Charactersheet uses HTML Local Storage to ensure that all your data is stored locally. Data may be *sent through* our servers, but it's never *stored on* them.


Installation
============

Installing charactersheet is pretty simple.

        mkdir charactersheet
        git clone https://github.com/charactersheet/charactersheet.git charactersheet
        cd charactersheet
        npm install
        npm test

That's it! If everything is green, then you're good to go!


Running
============

Now we only need to install a module called "serve" for serving our files and run it.

        npm install serve -g
        cd charactersheet && serve

You can now start your new adventures!


Have questions or just want to chat?
=====================

Join the conversations at: https://gitter.im/Sonictherocketman/adventurerscodex


How can I contribute?
=====================

You should check out our `CONTRIBUTING.md`! We'd love the help!
