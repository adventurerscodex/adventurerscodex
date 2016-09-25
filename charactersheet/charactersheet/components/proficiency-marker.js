'use strict';

/**
 * Proficiency Marker component
 *
 * A component for tracking proficiencies (none, half, proficient, expert) using
 * checkmarks of varying types.
 *
 * @params proficiencyType { string } The current proficiency type.
 * Values: 'none', 'half', 'proficient', 'expertise'
 *
 * <prof-marker params="proficiencyType: 'normal'></prof-marker>"
 */
function ProficiencyTypeComponentViewModel(params) {
    var self = this;

    self.proficiency = params.proficiency;

    /**
     * Given a type of proficiency, returns the HTML containing a
     * relevant icon for that type.
     */
    self.profTypeHTML = ko.computed(function() {
        var type = ko.utils.unwrapObservable(self.proficiency);

        try {
            type = type.toLowerCase();
        } catch (err) {
            return '';
        }

        if (type === 'expertise') {
            return ProficiencyTypeComponentViewModel.EXPERT_TEMPLATE;
        } else if (type === 'proficient') {
            return ProficiencyTypeComponentViewModel.NORMAL_TEMPLATE;
        } else if (type === 'half') {
            return ProficiencyTypeComponentViewModel.HALF_TEMPLATE;
        }
        return '';
    });
}

ProficiencyTypeComponentViewModel.EXPERT_TEMPLATE = '\
    <span data-bind="css: proficiencyLabel" class="fa fa-check close-check"></span>\
    <span data-bind="css: proficiencyLabel" class="fa fa-check"></span>';

ProficiencyTypeComponentViewModel.NORMAL_TEMPLATE = '\
    <span data-bind="css: proficiencyLabel" class="fa fa-check"></span>';

ProficiencyTypeComponentViewModel.HALF_TEMPLATE = '\
    <span data-bind="css: proficiencyLabel" class="fa fa-adjust"></span>';

ko.components.register('prof-marker', {
    viewModel: ProficiencyTypeComponentViewModel,
    template: '<span data-bind="html: profTypeHTML"></span>'
});
