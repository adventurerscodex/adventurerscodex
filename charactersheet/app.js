import ko from 'knockout'

import 'bin/knockout.mapping'

import 'charactersheet/components'
import 'charactersheet/migrations'
import 'charactersheet/models'
import 'charactersheet/services'
import 'charactersheet/utilities'

import  { AdventurersCodexViewModel } from 'charactersheet/viewmodels/common/root'
import { init } from 'charactersheet/init'

import template from './index.html'

window.viewModel = new AdventurersCodexViewModel();
init(window.viewModel);
ko.applyBindings(window.viewModel, $('#html')[0]);

//Setup automatic saving.
window.onbeforeunload = viewModel.unload;
