How to Contribute to Charactersheet
===================================

It's easy!

First, check out the issues on the GitHub page. If you're a new contributor, then you might want to check out the issues tagged `easy`. These are issues that are good for newcomers and others that aren't familiar with the application. Once you have a feature, or bug in mind, fork this repo, clone your fork and create a branch.

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

**Quoting:** In all Javascript, use of single quotes over double quotes is preferred.

**Function Syntax:** Please try to use the following syntax (referred to as variable assigned anonymous function syntax) for defining all functions except Knockout ViewModels. This is preferred over traditional function declarations because it is consistant with Knockout property definitions which are used throughout the app. Opening parens should be on the first line of the function with the function name.

```javascript
myFunction = function() {
	//...
}
```

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


Project Structure
=================

Character sheet is broken up into apps. Each app has it's own directory and structure, but the base formula is:

- app.js: This file contains the view model for knockout.js. This file also includes any other functionality for the module (data manipulation, import/export, etc.).

- index.html: This file is a one page demo of the app. It should not contain any template code, but instead import the app.templ.html file and use that as a template.

- app.templ.html: This is the HTML template that is included in the index.html and later in the main dashboard view.
