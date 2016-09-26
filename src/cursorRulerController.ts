import {CursorRuler} from './cursorRuler';
import {Disposable, window, workspace} from 'vscode'

export class CursorRulerController {

    private _cursorRuler: CursorRuler;
    private _disposable: Disposable;

    constructor(cursorRuler: CursorRuler) {
        this._cursorRuler = cursorRuler;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        workspace.onDidChangeConfiguration(this._onUpdateSettings, this, subscriptions);

        // update for current file
        this._onEvent();

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onUpdateSettings() {
        let config = workspace.getConfiguration('cursor-ruler');
        this._cursorRuler.updateStyling(config);
    }

    private _onEvent() {
        this._cursorRuler.updateRuler();
    }
}