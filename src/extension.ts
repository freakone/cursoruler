import {ExtensionContext, workspace} from 'vscode';
import {CursorRuler} from './cursorRuler';
import {CursorRulerController} from './cursorRulerController'

export function activate(context: ExtensionContext) {

    let config = workspace.getConfiguration('cursor-ruler');

    if (!config.has('enabled') || !config['enabled']) {
        return false;
    }

    let cursorRuler = new CursorRuler();
    cursorRuler.updateStyling(config);

    let controller = new CursorRulerController(cursorRuler);

    context.subscriptions.push(controller);
    context.subscriptions.push(cursorRuler);
}