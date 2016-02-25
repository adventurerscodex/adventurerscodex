# Version Deployment

- Update Changelog
- Create new version tag on develop
- Clone repo
- Delete old master locally if it exists
- Create new branch off of develop called master
- Turn off branch protection on the master branch
- Run the following:

```bash 
$ npm deploy
$ git add -f bower_components
$ git add .
$ git commit -am "{{Useful message here}}"
$ git push -f origin master
```
- Reenable branch protection on master

Congratulations! You've successfully deployed a new version of Adventurer's Codex!
