How to Contribute to Charactersheet
===================================

It's easy!

First, check out the issues on the GitHub page. Once you have a feature, or bug in mind, fork this repo, clone your fork and create a branch.

The branch you create should have a name like this:
	
	modulename-{issue number}
	ex: profile-12

If you are creating a module for the first time then the issue number should be the string `new`.

Make your modifications and submit a pull request! 

Thanks for contributing to character sheet!

Project Structure
=================

Character sheet is broken up into apps. Each app has it's own directory and structure, but the base formula is:

- app.js: This file contains the view model for knockout.js. This file also includes any other functionality for the module (data manipulation, import/export, etc.).

- index.html: This file is a one page demo of the app. It should not contain any template code, but instead import the app.templ.html file and use that as a template.

- app.templ.html: This is the HTML template that is included in the index.html and later in the main dashboard view.