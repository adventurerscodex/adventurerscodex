import ko from 'knockout';

// Global bootstrap modules
import 'bootstrap/js/collapse';
import 'bootstrap/js/dropdown';
import 'bootstrap/js/modal';
import 'bootstrap/js/tooltip';
import 'bootstrap/js/popover';
import Spinner from 'spin';

// Load Global KO Bindings
import 'bin/knockout-jquery-autocomplete';
import 'bin/knockout-element-binding';
import 'bin/knockout-bottomsup';
import 'bin/xmpp/muc.strophe';
import 'bin/knockout-bootstrap-modal';
import 'bin/knockout-find';

import 'charactersheet/components';
import 'charactersheet/migrations';
import 'charactersheet/viewmodels';
import 'charactersheet/models';
import 'charactersheet/services';
import 'charactersheet/utilities';

import { AdventurersCodexViewModel } from 'charactersheet/viewmodels/common/root';
import template from 'charactersheet/viewmodels/common/root/index.html';

import { init } from 'charactersheet/init';

$(() => {
    var viewModel = new AdventurersCodexViewModel();
    init(viewModel);

    // Setup automatic saving.
    window.onbeforeunload = viewModel.unload;

    ko.components.register('application', {
        viewModel: { instance: viewModel },
        template: template
    });

    ko.applyBindings();
});

window.keyAndMakeVisible = function() {
    $('#overlay').hide();
};

window.hideSplashScreen = function() {
    $('#loading').fadeOut(500);
    if (window.spinner) {
        window.spinner.stop();
    }
};

window.showSplashScreen = function() {
    $('#loading').fadeIn(100);
    // Start the spinner.
    window.spinner = new Spinner({ color:'#b4bcc2', lines: 12 }).spin(
        document.getElementsByTagName('body')[0]
    );
};
