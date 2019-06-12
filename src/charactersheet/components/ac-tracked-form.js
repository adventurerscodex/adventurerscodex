import campingTentWhite from 'images/camping-tent.svg';
import ko from 'knockout';
import meditationWhite from 'images/meditation.svg';

export class ACTrackedForm {
    constructor(params) {
        this.tracked = params.tracked;
        this.meditationWhite = meditationWhite;
        this.campingTentWhite = campingTentWhite;
    }
}

ko.components.register('ac-tracked-form', {
    viewModel: ACTrackedForm,
    template: '\
    <fieldset class="fieldset-bordered">\
      <legend>Tracked</legend>\
      <div data-bind="with: $component.tracked">\
        <div class="form-group">\
          <label for="bonus"\
                 class="control-label">Max</label>\
          <input type="number"\
                 class="form-control"\
                 min="1"\
                 required="true"\
                 data-bind="textInput: max">\
        </div>\
        <div class="form-group">\
          <label class="control-label">Resets on...</label>\
          <div class="btn-group btn-group-justified btn-group-sm"\
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
            <label class="btn btn-default  btn-sm"\
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
          </div>\
        </div>\
    </fieldset>\
    '
});
