function abilityScores() {
    this.str =  ko.observable('', { persist: 'abilityScores.str'});
    this.str_modifier =  ko.observable('', { persist: 'abilityScores.str_modifier'});
    this.dex =  ko.observable('', { persist: 'abilityScores.dex'});
    this.dex_modifier =  ko.observable('', { persist: 'abilityScores.dex_modifier'});
    this.con =  ko.observable('', { persist: 'abilityScores.con'});
    this.con_modifier =  ko.observable('', { persist: 'abilityScores.con_modifier'});
    this.int =  ko.observable('', { persist: 'abilityScores.int'});
    this.int_modifier =  ko.observable('', { persist: 'abilityScores.int_modifier'});
    this.wis =  ko.observable('', { persist: 'abilityScores.wis'});
    this.wis_modifier =  ko.observable('', { persist: 'abilityScores.wis_modifier'});
    this.cha =  ko.observable('', { persist: 'abilityScores.cha'});
    this.cha_modifier =  ko.observable('', { persist: 'abilityScores.cha_modifier'});

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