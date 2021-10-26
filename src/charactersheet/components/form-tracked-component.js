import { Tracked } from 'charactersheet/models/character';
import campingTentWhite from 'images/camping-tent.svg';
import { get } from 'lodash';
import ko from 'knockout';
import meditationWhite from 'images/meditation.svg';
import dawnWhite from 'images/sunrise.svg';
import quillWhite from 'images/quill.svg';

/**
 * tracked form
 *
 * A component that provides a form for tracked items.
 *
 * @param tracked {observable} The tracked data model to be modified.
 *
 * Usage:
 * <form-tracked-component params="{
 * tracked: modelObjectInstance.tracked
 * }"></form-tracked-component>

 */

export class TrackedForm {
    constructor(params) {
        this.tracked = params.tracked;
        this.formElementHasFocus = ko.observable(false);
        if (params.hasFocus) {
            this.formElementHasFocus = params.hasFocus;
        }
        this.layoutDirection = params.layoutDirection || 'horizontal';
    }
    meditationWhite = meditationWhite;
    campingTentWhite = campingTentWhite;
    dawnWhite = dawnWhite;
    quillWhite = quillWhite;

    validation = {
        ...get(Tracked, 'validationConstraints.fieldParams', {})
    };

    reviewInput = (data, event) => {
        if (event.target.checkValidity()) {
            event.target.classList.remove('error');
        } else {
            event.target.classList.add('error');
        }
    }

    invalidate = (data, event) => {
        event.target.classList.add('error');
        return true; // Continue validating
    }

    largeLayoutCss = () => {
        return (
            this.layoutDirection === 'horizontal'
            // Horizontal on small devices, vertical on big.
            ? 'btn-group btn-group-justified btn-group-sm'
            : 'btn-group-vertical d-block btn-group-sm'
        );
    }

    smallLayoutCss = () => {
        // Vertical layout regardless
        return 'btn-group-vertical d-block btn-group-sm';
    }
}

ko.components.register('form-tracked-component', {
    viewModel: TrackedForm,
    template: '\
    <fieldset class="fieldset-bordered">\
      <legend>Tracked</legend>\
      <div data-bind="with: $component.tracked">\
        <div class="form-group">\
          <label for="bonus"\
                 class="control-label">Max</label>\
          <input class="form-control"\
                 data-bind="value: max,\
                 attr: { ...$component.validation.max },\
                 event: { blur: $component.reviewInput, invalid: $component.invalidate },\
                 hasFocus: $component.formElementHasFocus">\
        </div>\
        <div class="form-group hidden-xs hidden-sm">\
          <label class="control-label">Resets on...</label>\
          <div data-bind="class: $component.largeLayoutCSS()" \
               role="group">\
            <label class="btn btn-default btn-sm"\
                   data-bind="css: { active: resetsOn() === \'short\'}">\
              <input type="radio"\
                     class="hide-block"\
                     name="featureResetsOnShort"\
                     value="short"\
                     data-bind="checked: resetsOn" />\
              <img class="action-bar-icon"\
                   data-bind="attr: { src: $component.meditationWhite }"></img>\
              &nbsp;&nbsp;&nbsp;Short Rest\
            </label>\
            <label class="btn btn-default btn-sm"\
                   data-bind="css: { active: resetsOn() === \'long\'}">\
              <input type="radio"\
                     class="hide-block"\
                     name="featureResetsOnLong"\
                     value="long"\
                     data-bind="checked: resetsOn" />\
              <img class="action-bar-icon"\
                   data-bind="attr: { src: $component.campingTentWhite }"></img>\
              &nbsp;&nbsp;&nbsp;Long Rest\
            </label>\
            <label class="btn btn-default btn-sm"\
                   data-bind="css: { active: resetsOn() === \'dawn\'}">\
              <input type="radio"\
                     class="hide-block"\
                     name="featureResetsOnDawn"\
                     value="dawn"\
                     data-bind="checked: resetsOn" />\
              <img class="action-bar-icon"\
                   data-bind="attr: { src: $component.dawnWhite }"></img>\
              &nbsp;&nbsp;&nbsp;At Dawn\
            </label>\
            <label class="btn btn-default btn-sm"\
                   data-bind="css: { active: resetsOn() === \'none\'}">\
              <input type="radio"\
                     class="hide-block"\
                     name="featureResetsNever"\
                     value="none"\
                     data-bind="checked: resetsOn" />\
              <img class="action-bar-icon"\
                   data-bind="attr: { src: $component.quillWhite }"></img>\
              &nbsp;&nbsp;&nbsp;Manually\
            </label>\
          </div>\
        </div> \
        <div class="form-group visible-xs visible-sm">\
          <label class="control-label">Resets on...</label>\
          <div data-bind="class: $component.smallLayoutCSS()" \
               role="group">\
            <label class="btn btn-default btn-sm"\
                   data-bind="css: { active: resetsOn() === \'short\'}">\
              <input type="radio"\
                     class="hide-block"\
                     name="featureResetsOnShort"\
                     value="short"\
                     data-bind="checked: resetsOn" />\
              <img class="action-bar-icon"\
                   data-bind="attr: { src: $component.meditationWhite }"></img>\
              &nbsp;&nbsp;&nbsp;Short Rest\
            </label>\
            <label class="btn btn-default btn-sm"\
                   data-bind="css: { active: resetsOn() === \'long\'}">\
              <input type="radio"\
                     class="hide-block"\
                     name="featureResetsOnLong"\
                     value="long"\
                     data-bind="checked: resetsOn" />\
              <img class="action-bar-icon"\
                   data-bind="attr: { src: $component.campingTentWhite }"></img>\
              &nbsp;&nbsp;&nbsp;Long Rest\
            </label>\
            <label class="btn btn-default btn-sm"\
                   data-bind="css: { active: resetsOn() === \'dawn\'}">\
              <input type="radio"\
                     class="hide-block"\
                     name="featureResetsOnDawn"\
                     value="dawn"\
                     data-bind="checked: resetsOn" />\
              <img class="action-bar-icon"\
                   data-bind="attr: { src: $component.dawnWhite }"></img>\
              &nbsp;&nbsp;&nbsp;At Dawn\
            </label>\
            <label class="btn btn-default btn-sm"\
                   data-bind="css: { active: resetsOn() === \'none\'}">\
              <input type="radio"\
                     class="hide-block"\
                     name="featureResetsNever"\
                     value="none"\
                     data-bind="checked: resetsOn" />\
              <img class="action-bar-icon"\
                   data-bind="attr: { src: $component.quillWhite }"></img>\
              &nbsp;&nbsp;&nbsp;Manually\
            </label>\
          </div>\
        </div>\
    </fieldset>\
    '
});
