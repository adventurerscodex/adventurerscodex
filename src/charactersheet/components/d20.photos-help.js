import ko from 'knockout';

ko.components.register('d20photos-help', {
    template: '\
    <small class="text-muted d20photos-help"> \
      Looking for images? \
      <a target="_blank" \
        title="Search d20.photos to find more cool images for your game." \
        href="https://d20.photos?r=ac">Check out d20.photos &#8594;</a> \
    </small>'
});
