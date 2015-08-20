# Design

The app is a series of modules:
	/
		index.html
		app.js
		notes/
		backpack/
		...

Each module contains:
	/	
		index.html					# A sample of the app.
		package.tmpl.html		# The template for the app.
		app.js							# The knockout js for the app.

This way we can have a standard format for each module.

The main index.html will import all templates and modules and display them automatically.