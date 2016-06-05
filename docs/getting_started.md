Getting Started
===============


For Developers
--------------

If you're looking to help out with developing Adventurer's Codex, then follow these quick steps to get the project set up.

### Installation

```bash
$ git clone https://github.com/adventurerscodex/charactersheet.git
$ cd charactersheet
$ npm install
```

### Testing

If you'd like to run the tests, you can do so like this:

```bash
$ npm test
```

### Making the Docs

To build and generate the documentation, use the following command.

```bash
$ npm run docs
```

The documentation is generated in a `_build_docs` directory. To view, open `index.html`.


For Self-Hosters
----------------

Adventurer's Codex is fully open source, and can be self-hosted by anyone. If you're looking to start up your own Adventurer's Codex setup, then follow the instructions below.

### Installation

The first thing you'll need to do to get started with Adventurer's Codex is install it on a server, or run it locally. To do this, you'll need to clone the repo.

```bash
$ git clone https://github.com/adventurerscodex/charactersheet.git
$ cd charactersheet
$ npm install
```

### Hosting

If you're hosting Adventurer's Codex locally, then you can serve the charactersheet folder like so:

```bash
$ npm install -g serve
$ serve charactersheet/
```

If you're looking to deploy Adventurer's Codex to a sever, for public use, then you'll need something more robust than `npm serve`.

Since Adventurer's Codex is an entirely client-side application, there's no need for anything more complicated than static file hosting. Simply extract the `charactersheet` directory to your `static/` files directory in Apache, Nginx, S3, etc and load up the page!
