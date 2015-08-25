function Spells() {
    this.name = ko.observable('', { persist: 'name.text' });
    this.school = ko.observable('', { persist: 'school.text' });
    this.level = ko.observable('', { persist: 'level.text' });
    this.description = ko.observable('', { persist: 'description.text' });

    this.clear = function() {
        this.name('');
    };

    this.importValues = function(values) {
        this.name(values.name);
    };

    this.exportValues = function() {
        return {
            name: this.name()
        }
    };
};