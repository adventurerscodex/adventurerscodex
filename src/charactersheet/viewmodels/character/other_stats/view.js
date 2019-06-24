import 'bin/popover_bind';
import {
    AbilityScore,
    OtherStats
} from 'charactersheet/models/character';
import {
    ArmorClassService,
    ProficiencyService
} from 'charactersheet/services';
import {
    CoreManager,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { AbstractViewModel } from 'charactersheet/viewmodels/abstract';
import autoBind from 'auto-bind';
import { getModifier } from 'charactersheet/models/character/ability_score';
import ko from 'knockout';
import template from './view.html';

export class OtherStatsViewModel extends AbstractViewModel {
    constructor(params) {
        super(params);
        this.dexterity = ko.observable(new AbilityScore());
        autoBind(this);
    }
    modelName = 'OtherStats';

    async load() {
        await super.load();
        await this.getDexterity();
    }

    armorClass = ko.pureComputed(() => {
        return ArmorClassService.sharedService().armorClass();
    })

    setUpSubscriptions = () => {
        super.setUpSubscriptions();
        Notifications.abilityscore.changed.add(this.updateDexterity);
    }

    getDexterity = async () => {
        const key = CoreManager.activeCore().uuid();
        const response = await AbilityScore.ps.list({
            coreUuid: key,
            name: Fixtures.abilityScores.constants.dexterity.name
        });
        this.dexterity(response.objects[0]);
    }

    updateDexterity = (abilityScore) => {
        if (abilityScore && abilityScore.name() === Fixtures.abilityScores.constants.dexterity.name) {
            this.dexterity().importValues(abilityScore.exportValues());
        }
    }

    proficiency = ko.pureComputed(()=> {
        return ProficiencyService.sharedService().proficiency();
    })

    proficiencyLabel = ko.pureComputed(()=> {
        // let bonus = ProficiencyService.sharedService().proficiency();
        // The modifier is added in the service, so no need to duplicate here
        if (this.proficiency() < 0) {
            return `- ${Math.abs(this.proficiency())}`;
        }
        return `+ ${this.proficiency()}`;
    })

    proficiencyPopover = ko.pureComputed(() => {
        const level = ProficiencyService.sharedService().proficiencyBonusByLevel();
        return '<span style="white-space:nowrap;"><strong>Proficiency</strong> = '
          + '(<strong>Level</strong> / 4) + 1 + <strong>Modifier</strong></span><br />'
          + `Proficiency = ${level} + 1 + ${this.entity().proficiencyModifier()}`;
    })

    initiativeLabel = ko.pureComputed(() => {
        let bonus = this.dexterity().getModifier();
        if (this.entity().initiativeModifier()) {
            bonus += parseInt(this.entity().initiativeModifier());
        }
        if (bonus < 0) {
            return `- ${Math.abs(bonus)}`;
        }
        return `+ ${bonus}`;
    })

    initiativePopover = ko.pureComputed(() => {
        const dexMod = this.dexterity().getModifier();
        return '<span style="overflow: visible; white-space:nowrap;"><strong>Initiative</strong> = ' +
               'Dexterity Modifier + Modifier</span><br />' +
               `Initiative = ${dexMod} + ${this.entity().initiativeModifier()}`;
    })

    armorClassPopover = ko.pureComputed(()=> {
        const baseAC = ArmorClassService.sharedService().baseArmorClass();
        const dexMod = ArmorClassService.sharedService().dexBonusFromArmor();
        const magicModifiers = ArmorClassService.sharedService().equippedArmorMagicalModifier() +
                               ArmorClassService.sharedService().equippedShieldMagicalModifier();
        const shield = ArmorClassService.sharedService().getEquippedShieldBonus();
        const modifier = this.entity().armorClassModifier() ? this.entity().armorClassModifier() : 0;
        return '<span><strong>Armor Class</strong> = '
       + 'Base AC + Dexterity Modifier + Magical Modifier(s) + Shield + Modifier</span><br />'
       + `<strong>Armor Class</strong> = ${baseAC} + ${dexMod} + ${magicModifiers} + ${shield} + ${modifier}`;

    })

    toggleInspiration = async () => {
        this.entity().inspiration(!this.entity().inspiration());
        await this.entity().save();
    }
}

ko.components.register('other-stats-view', {
    viewModel: OtherStatsViewModel,
    template: template
});
