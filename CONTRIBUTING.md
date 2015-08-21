# How to Contribute to Charactersheet

It's easy!

First, check out the issues on the GitHub page. Once you have a feature, or bug in mind, fork this repo, clone your fork and create a branch.

The branch you create should have a name like this:
	
	modulename-{issue number}
	ex: profile-12

If you are creating a module for the first time then the issue number should be the string `new`.

	ex: profile-new

Make your modifications and submit a pull request! 

Thanks for contributing to character sheet!

# Installing 

1. Get the code:
	
		cd <wherever you want>
		git clone https://github.com/charactersheet/charactersheet

2. Install the bower dependencies:

		cd charactersheet
		bower install bower.json

If you're using FireFox or Safari, then you're done! If you're using Chrome then there's one more step.

3. Since Chrome won't allow cross domain requests from local files (for some reason) you'll need to start up a web server. The easiest version is the `npm` one. Just make sure you're in the same directory as the project.

		npm install -g serve && serve
		
# Project Structure

Character sheet is broken up into apps. Each app has it's own directory and structure, but the base formula is:

- app.js: This file contains the view model for knockout.js. This file also includes any other functionality for the module (data manipulation, import/export, etc.).

- index.html: This file is a one page demo of the app. It should not contain any template code, but instead import the app.templ.html file and use that as a template.

- app.templ.html: This is the HTML template that is included in the index.html and later in the main dashboard view.