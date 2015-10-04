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

**Function Syntax:** Please try to use the following syntax (referred to as variable assigned anonymous function syntax) for defining all functions except Knockout ViewModels. This is preferred over traditional function declarations because it is consistant with Knockout property definitions which are used throughout the app. Opening parens should be on the first line of the function with the function name.

```javascript
myFunction = function() {
	//...
}
```

**File Naming:** All files with multi-word names should be seperated with underscores (i.e. `node_modules` or `ability_scores`); hyphens are strongly discouraged.


App.js File structure
---------------------

When designing a module, the app.js file should be in the following format:

1. The Knockout ViewModel for that module.
2. Any jQuery plugins that need to be instantiated at page load. Please remember to wrap all of these functions in a jQuery document onload function.
3. Any global functions. Be sure to use the variable assigned anonymous function syntax, as it is consistant with the knockout style functions syntax.

Example `app.js` file:
```javascript	
"use strict";
function SomeModule() {
	//Knockout class...
}	
$(function() {
	//Instantiate jQuery funcions...
});
someGlobalFunction = function() {
	//...
}
```	


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
