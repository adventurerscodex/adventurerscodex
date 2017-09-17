import ko from 'knockout'

import 'bootstrap'

import 'charactersheet/components'
import 'charactersheet/migrations'
import 'charactersheet/models'
import 'charactersheet/services'
import 'charactersheet/utilities'

import 'charactersheet/viewmodels/common/root'
import { init } from 'charactersheet/init'

// init(window.viewModel);

//Setup automatic saving.
// window.onbeforeunload = viewModel.unload;

ko.applyBindings();

