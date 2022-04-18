import ko from 'knockout';

ko.components.register('compendium-help', {
    template: '\
    <small class="text-muted compendium-help"> \
      <a target="_blank" \
        title="Explore the Adventurer\'s Codex Compendium" \
        href="https://app.adventurerscodex.com/explore/">Browse the Compendium &#8594;</a> \
    </small>'
});
