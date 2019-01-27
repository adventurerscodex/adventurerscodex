import ko from 'knockout';
import template from './index.html';

export function WizardFileImportErrorStepViewModel(params) {
    var self = this;

    self.TEMPLATE_FILE = 'wizard_file_import_error_step.tmpl';
    self.IDENTIFIER = 'WizardFileImportErrorStep';

    self.ticketNumber = params.ticketNumber;

    self.init = function () { };

    self.load = function () { };

    self.unload = function () { };
}

ko.components.register('wizard-file-import-error-step', {
    viewModel: WizardFileImportErrorStepViewModel,
    template: template
});
