import ko from 'knockout'

import 'bootstrap'

import 'charactersheet/components'
import 'charactersheet/migrations'
import 'charactersheet/models'
import 'charactersheet/services'
import 'charactersheet/utilities'

import { AdventurersCodexViewModel, template } from 'charactersheet/viewmodels/common/root'
import template from 'charactersheet/viewmodels/common/root/index.html'

import { init } from 'charactersheet/init'


var viewModel = new AdventurersCodexViewModel();
init(viewModel);

// Setup automatic saving.
window.onbeforeunload = viewModel.unload;

ko.components.register('app', {
  viewModel: { instance: viewModel },
  template: template
});

ko.applyBindings();

