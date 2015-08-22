How to Contribute to Charactersheet
===================================

It's easy!

First, check out the issues on the GitHub page. Once you have a feature, or bug in mind, fork this repo, clone your fork and create a branch.

The branch you create should have a name like this:
	
	modulename-{issue number}
	ex: profile-12

If you are creating a module for the first time then the issue number should be the string `new`.

	ex. profile-new

Make your modifications and submit a pull request! 

Thanks for contributing to character sheet!

Issues and Features
===================

Please look through the issues list and feel free to ask questions! A lot of the issues can appear terse, but its probably because they're 'notes to our future-selves'. If a feature looks interesting to you, but you're not clear on the details, ask away!

Technologies
============

Knockout.js for the front end.
jQuery for the async networking.
Bootstrap for the styling.

What should each module contain?
================================

Unless otherwise specified, every module should contain the following functionalities:

- Import/Export of player data. The notable exception to this is the combat log. These functions should import a native javascript object and export one as well. It should be able to be called at any time and replace all the data that existed beforehand.
- A function to clear all of the fields and delete the data.  
- Should follow the basic structure defined below.

Project Structure
=================

Character sheet is broken up into apps. Each app has it's own directory and structure, but the base formula is:

- app.js: This file contains the view model for knockout.js. This file also includes any other functionality for the module (data manipulation, import/export, etc.).

- index.html: This file is a one page demo of the app. It should not contain any template code, but instead import the app.templ.html file and use that as a template.

- app.templ.html: This is the HTML template that is included in the index.html and later in the main dashboard view.