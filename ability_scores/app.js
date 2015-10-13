"use strict";

function AbilityScores() {
    this.str =  ko.observable('');
    this.str_modifier =  ko.observable('');
    this.dex =  ko.observable('');
    this.dex_modifier =  ko.observable('');
    this.con =  ko.observable('');
    this.con_modifier =  ko.observable('');
    this.int =  ko.observable('');
    this.int_modifier =  ko.observable('');
    this.wis =  ko.observable('');
    this.wis_modifier =  ko.observable('');
    this.cha =  ko.observable('');
    this.cha_modifier =  ko.observable('');

    this.clear = function() {
        this.str('');
        this.str_modifier('');
        this.dex('');
        this.dex_modifier('');
        this.con('');
        this.con_modifier('');
        this.int('');
        this.int_modifier('');
        this.wis('');
        this.wis_modifier('');
        this.cha('');
        this.cha_modifier('');
    };

    this.importValues = function(values) {
        this.str(values.str);
        this.str_modifier(values.str_modifier);
        this.dex(values.dex);
        this.dex_modifier(values.dex_modifier);
        this.con(values.con);
        this.con_modifier(values.con_modifier);
        this.int(values.int);
        this.int_modifier(values.int_modifier);
        this.wis(values.wis);
        this.wis_modifier(values.wis_modifier);
        this.cha(values.cha);
        this.cha_modifier(values.cha_modifier);
    };

    this.exportValues = function() {
        return {
            str: this.str(),
            str_modifier: this.str_modifier(),
            dex: this.dex(),
            dex_modifier: this.dex_modifier(),
            con: this.con(),
            con_modifier: this.con_modifier(),
            int: this.int(),
            int_modifier: this.int_modifier(),
            wis: this.wis(),
            wis_modifier: this.wis_modifier(),
            cha: this.cha(),
            cha_modifier: this.cha_modifier()
        }
    };
};
