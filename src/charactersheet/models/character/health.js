import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import ko from 'knockout';


export class Health extends KOModel {
    static __skeys__ = ['core', 'characters', 'health'];

    static mapping = {
        include: ['coreUuid']
    };

    DANGER_THRESHOLD = 0.30;
    WARNING_THRESHOLD = 0.50;

    uuid = ko.observable(null);
    maxHitPoints = ko.observable(10);
    tempHitPoints = ko.observable(0);
    damage = ko.observable(0);

    hitpoints = ko.pureComputed(() => {
        return this.regularHitpointsRemaining();
    });

    totalHitpoints = ko.pureComputed(() => {
        var maxHP = this.maxHitPoints() ? parseInt(this.maxHitPoints()) : 0;
        var tempHP = this.tempHitPoints() ? parseInt(this.tempHitPoints()) : 0;
        return maxHP + tempHP;
    });

    tempHitpointsRemaining = ko.pureComputed(() => {
        var tempHP = this.tempHitPoints() ? parseInt(this.tempHitPoints()) : 0;
        return tempHP;
    });

    regularHitpointsRemaining = ko.pureComputed(() => {
        return this.maxHitPoints() - this.damage();
    });

    //Progress bar methods.

    hitpointsText = ko.pureComputed(() => {
        var text = 'HP: ' + this.hitpoints().toString();
        if (this.tempHitPoints() > 0) {
            return text + ', Temp HP: ' + this.tempHitPoints().toString();
        }
        return text;
    });

    isKnockedOut = ko.pureComputed(() => {
        return parseInt(this.hitpoints()) / parseInt(this.totalHitpoints()) <= 0 ? true : false;
    });

    isDangerous = ko.pureComputed(() => {
        return parseInt(this.hitpoints()) / parseInt(this.totalHitpoints()) < this.DANGER_THRESHOLD ? true : false;
    });

    isWarning = ko.pureComputed(() => {
        return parseInt(this.hitpoints()) / parseInt(this.totalHitpoints()) < this.WARNING_THRESHOLD ? true : false;
    });

    progressType = ko.pureComputed(() => {
        var type = 'progress-bar-success';
        if (this.isWarning()) { type = 'progress-bar-warning'; }
        if (this.isDangerous()) { type = 'progress-bar-danger'; }
        return type;
    });

    regularProgressWidth = ko.pureComputed(() => {
        if (this.isKnockedOut()) {
            return '100%';
        }
        return (parseInt(this.regularHitpointsRemaining()) / parseInt(this.totalHitpoints()) * 100) + '%';
    });

    tempProgressWidth = ko.pureComputed(() => {
        if (this.tempHitpointsRemaining() < 0) {
            return '0%';
        }
        return (parseInt(this.tempHitpointsRemaining()) / parseInt(this.totalHitpoints()) * 100) + '%';
    });
}