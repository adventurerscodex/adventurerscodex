import ko from 'knockout';

ko.components.register('markdown-help', {
    template: '\
    <small class="text-muted"> \
      Text in this panel can be styled using Markdown. Click \
      <a target="_blank" \
        href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">here</a> to see a guide. \
    </small>'
});
