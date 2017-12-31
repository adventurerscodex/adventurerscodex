import icon from 'images/logo-full-circle-icon.png';
import ko from 'knockout';
import template from './index.html';

export function WizardAbilityScoresStepViewModel(params) {
    var self = this;

    self.icon = icon;
    self.TEMPLATE_FILE = 'wizard_ability_scores_step.tmpl';
    self.IDENTIFIER = 'WizardAbilityScoresStep';
    self.stepReady = params.stepReady;
    self.stepResult = params.results;

    self.REQUIRED_FIELDS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    self.POINT_BUY_MAX_POINTS = 27;
    self.POINT_BUY_MAP = {
        '8': 0,
        '9': 1,
        '10': 2,
        '11': 3,
        '12': 4,
        '13': 5,
        '14': 7,
        '15': 9
    };

    // View Model Methods

    self.init = function() { };

    self.load = function() {
        self.str.subscribe(self.dataHasChanged);
        self.dex.subscribe(self.dataHasChanged);
        self.con.subscribe(self.dataHasChanged);
        self.int.subscribe(self.dataHasChanged);
        self.wis.subscribe(self.dataHasChanged);
        self.cha.subscribe(self.dataHasChanged);
        self.isPointBuy.subscribe(self.initPointBuy);
        self.isManual.subscribe(self.initManual);
        self.pointsLeft.subscribe(self.pointsLeftChanged);
    };

    self.unload = function() { };

    // View Properties

    self.str = ko.observable().extend({ required: '&#9679; Required' });
    self.dex = ko.observable().extend({ required: '&#9679; Required' });
    self.con = ko.observable().extend({ required: '&#9679; Required' });
    self.int = ko.observable().extend({ required: '&#9679; Required' });
    self.wis = ko.observable().extend({ required: '&#9679; Required' });
    self.cha = ko.observable().extend({ required: '&#9679; Required' });

    // Wizard Step Methods

    self.dataHasChanged = function() {
        self.results();
        self.ready();
    };

    // Die Roll methods

    self.rollMethod = ko.observable('manual');
    self.pointBuyMin = ko.observable(8);
    self.pointBuyMax = ko.observable(15);

    self.isPointBuy = ko.pureComputed(function() {
        return self.rollMethod() === 'pointBuy';
    });

    self.pointsLeft = ko.pureComputed(function() {
        if (self.isPointBuy()) {
            var pointsSpent = 0;
            const abilityScores = [
                self.str(),
                self.dex(),
                self.con(),
                self.int(),
                self.wis(),
                self.cha()
            ];

            abilityScores.map(function(score, idx, _) {
                pointsSpent += self.POINT_BUY_MAP[score];
            });
            return self.POINT_BUY_MAX_POINTS - pointsSpent;
        } else {
            return 0;
        }
    });

    /**
     * This is required because ready is invoked before pointsLeft is
     * calculated. This way, ready will evaluate pointsLeft after the stepper
     * is finished.
     */
    self.pointsLeftChanged = function() {
        self.ready();
    };

    self.pointsLeftColor = ko.computed(function() {
        if (self.pointsLeft() >= 0) {
            return 'text-success';
        } else {
            return 'text-danger';
        }
    });

    self.isManual = ko.pureComputed(function() {
        return self.rollMethod() === 'manual';
    });

    self.initPointBuy = function() {
        if (self.isPointBuy()) {
            self.str(8);
            self.dex(8);
            self.con(8);
            self.int(8);
            self.wis(8);
            self.cha(8);
        }
    };

    self.initManual = function() {
        if (self.isManual()) {
            self.str('');
            self.dex('');
            self.con('');
            self.int('');
            self.wis('');
            self.cha('');
        }
    };
    /**
     * Determine if the finish button should be rendered.
     */
    self.ready = ko.pureComputed(function() {
        if (self.rollMethod() === 'pointBuy' && self.pointsLeft() === 0) {
            self.stepReady(true);
        } else {
            self.stepReady(false);
        }
        if (self.rollMethod() === 'manual') {
            var emptyFields = self.REQUIRED_FIELDS.filter(function(field, idx, _) {
                return self[field]() ? !self[field]() : true;
            });
            self.stepReady(emptyFields.length === 0);
        }
    });

    /**
     * Returns an object containing the current values for
     * the fields in the form.
     */
    self.results = ko.pureComputed(function() {
        self.stepResult( {
            str: self.str(),
            dex: self.dex(),
            con: self.con(),
            int: self.int(),
            wis: self.wis(),
            cha: self.cha()
        });
    });
}

ko.components.register('wizard-ability-score-step', {
    viewModel: WizardAbilityScoresStepViewModel,
    template: template
});