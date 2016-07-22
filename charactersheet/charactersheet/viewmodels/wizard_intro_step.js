'use strict';

function WizardIntroStepViewModel() {
  var self = this;

  self.ready = ko.observable(false);
  /**
   * Possible values of Player type are: player, dm, import.
   */
  self.results = ko.observable({ PlayerType: ''});
  self.wellOpen = ko.observable(false);

  self.fileContents = ko.observable();
  self.fileReader = new FileReader();

  self.setPlayerType = function(type) {
    self.results().PlayerType = type;
  };

  self.toggleWellOpen = function() {
      self.wellOpen(!self.wellOpen());
      //Initialize dropbox integrations.
      var button = Dropbox.createChooseButton(Settings.dropboxConfigOptions);
      document.getElementById('dropbox-container').appendChild(button);
  };

  self.arrowIconClass = ko.pureComputed(function() {
      return self.wellOpen() ? 'fa fa-caret-up' : 'fa fa-caret-down';
  });

  self.importFromFile = function() {
      //The first comma in the result file string is the last
      //character in the string before the actual json data
      var length = self.fileReader.result.indexOf(',') + 1;
      var values = JSON.parse(atob(self.fileReader.result.substring(
          length, self.fileReader.result.length)));

      var character = Character.importCharacter(values);
      Notifications.characters.changed.dispatch();

      CharacterManager.changeCharacter(character.key());
      self.clear();
  };

  WizardIntroStepViewModel.importRemoteFile = function(files) {
      $.getJSON(files[0].link).done(function(data) {
          var character = Character.importCharacter(data);
          Notifications.characters.changed.dispatch();

          CharacterManager.changeCharacter(character.key());
      }).error(function(err) {
          //TODO: Alert user of error
      });
  };


  self.save = function() {};

}
