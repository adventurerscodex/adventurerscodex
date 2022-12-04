import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import { ViewModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services/common';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import { keymap } from 'prosemirror-keymap'
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {schema} from "prosemirror-schema-basic"
import { exampleSetup } from 'prosemirror-example-setup'

export class PartyNoteViewModel extends ViewModel {
    constructor(params) {
        super(params);
        autoBind(this);

        this.prosemirrorView = null;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.party.changed.add(this.partyDidChange));
        this.subscriptions.push(Notifications.party.connected.add(this.partyDidConnect));
    }

    setupEditor() {
        if (!!this.prosemirrorView) {
            console.log('Refusing to re-configure prosemirror');
            return;
        }

        this.prosemirrorView = new EditorView(document.querySelector('#party-note-editor'), {
          state: EditorState.create({
            schema,
            plugins: [
                ySyncPlugin(PartyService.getPartyNote()),
                yCursorPlugin(PartyService.awareness),
                yUndoPlugin(),
                keymap({
                  'Mod-z': undo,
                  'Mod-y': redo,
                  'Mod-Shift-z': redo
                })
              ].concat(exampleSetup({ schema }))
          })
        })
    }

    // Events

    partyDidChange(party) {
        console.log('Party changed...')
    }

    partyDidConnect(party) {
        this.setupEditor();
    }
}

ko.components.register('party-note', {
    viewModel: PartyNoteViewModel,
    template: template
});
