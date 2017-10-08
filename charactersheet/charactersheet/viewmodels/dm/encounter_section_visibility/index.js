import ko from 'knockout'

import template from './index.html'


export function EncounterSectionVisibilityViewModel(params) {
    var self = this;

    self.section = params.section;

    self.visible = self.section.visible;
    self.name = self.section.name;
    self.tagline = self.section.tagline;
}


ko.components.register('encounter-section-visibility', {
  viewModel: EncounterSectionVisibilityViewModel,
  template: template
});
