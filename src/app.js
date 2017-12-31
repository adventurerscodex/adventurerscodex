import ko from 'knockout'

import 'bootstrap'
import 'font-awesome-webpack'
import Spinner from 'spin'

// Load Global KO Bindings
import 'bin/knockout-jquery-autocomplete'
import 'bin/knockout-bottomsup'
import 'bin/xmpp/muc.strophe'
import 'bin/knockout-bootstrap-modal'

import 'charactersheet/components'
import 'charactersheet/migrations'
import 'charactersheet/viewmodels'
import 'charactersheet/models'
import 'charactersheet/services'
import 'charactersheet/utilities'

import { AdventurersCodexViewModel } from 'charactersheet/viewmodels/common/root'
import template from 'charactersheet/viewmodels/common/root/index.html'

import { init } from 'charactersheet/init'


var spinner = new Spinner({color:'#b4bcc2', lines: 12}).spin(
    document.getElementsByTagName('body')[0]
);

var viewModel = new AdventurersCodexViewModel();
init(viewModel);

// Setup automatic saving.
window.onbeforeunload = viewModel.unload;

ko.components.register('application', {
  viewModel: { instance: viewModel },
  template: template
});


ko.applyBindings();
spinner.stop();
