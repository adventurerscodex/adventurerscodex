How to Contribute to Charactersheet
===================================

It's easy!

To get started with setting up your development environment, head over to [Getting Started](/docs/getting-started.md).

Code Conventions
===========

Charactersheet has it's own style guide for Javascript, HTML, and CSS. If you
use an editor supported by [Editor Config][ec] then everything should work
automatically. Otherwise the conventions are listed below.


Javascript
----------
    indent_size = space
    indent_size = 4

JSON, YAML, CSS, and HTML
------------------------------
    indent_style = space
    indent_size = 2

[ec]: http://editorconfig.org


 Style Guide
-----------

As this is Javascript, the code style guide is as follows.

**Casing:** camelCase with the first letter lowercase unless the value is a Knockout ViewModel or other psudo-class object definition.

**Quoting:** In all Javascript, use of single quotes over double quotes is preferred.

**File Naming:** All files with multi-word names should be seperated with underscores (i.e. `node_modules` or `ability_scores`); hyphens are strongly discouraged.


Issues and Features
===================

Please look through the issues list and feel free to ask questions! A lot of the issues can appear terse, but its probably because they're 'notes to our future-selves'. If a feature looks interesting to you, but you're not clear on the details, ask away!


Technologies
============

Knockout.js for the front end.
jQuery for the async networking.
Bootstrap for the styling.
Mocha for unittesting
Karma, Grunt, and Istanbul for measuring code converage.
