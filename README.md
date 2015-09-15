# Charactersheet

![Build Badge](https://travis-ci.org/charactersheet/charactersheet.svg)

A tool to help D&D 5e players keep their ducks in a row. 

What is it?
===========

Charactersheet is a project that aims to take the friction out of some aspects of playing D&D while not removing the classic elements of the game. Unlike other tools, this project is not aiming to automate elements like rolling dice, or leveling up. We've found that tools trying to make the game simpler, actually make it harder for players by forcing them to play by-the-book. There's usually no regard for house rules. 

Charactersheet's goal is to make the game more immersive, and bring it into the 21st century.

Features
========

Although not entirely implemented yet, Charactersheet will be not only be able to keep track of a character's stats and abilities, but it will have a suite of never-before seen features.

Some planned features include:

- A spell book and backpack that autocompletes with suggestions from the official equipment/spell lists. These will only be suggestions, and players can create new spells and items too!
- A group combat tracker that keeps updated with the actions of all of the players in your party… AUTOMATICALLY!
- A captain's log for players to keep important notes.
- Private chat between individual players (for those secret deals and bribes).
- A day/night tracker. Make sure you've made camp before night falls!
- And many more!

Where's my data stored?
=======================

Here's the cool part: all your data is stored on your local machine! There's no server that's keeping a log of your characters, your adventures, or your party! 

Charactersheet uses HTML Local Storage to ensure that all your data is stored locally. Data may be *sent through* our servers, but it's never *stored on* them.

Where is it?
============

It's not live just yet, but it will be soon! Check back for more details.

Installation
============

Installing charactersheet is pretty simple. 

1. Clone the repo 
    
    `git clone https://github.com/charactersheet/charactersheet.git`

2. Install the bower dependencies and the node dependencies (Node dependencies
   are only needed for running the tests).

	`npm install && bower install`

3. Check that your installation works by opening `mocha.html` in your browser.
   All the unit tests should pass. Next open `index.html`. 

That's it!

How can I contribute?
=====================

You should check out our `CONTRIBUTING.md`! We'd love the help! 
