import {window, Range, WorkspaceConfiguration} from 'vscode'

export class CursorRuler {

    public styling = {
        borderColor: 'lightgrey',
        borderSpacing: "1px",
        borderStyle: 'none none none solid',
        borderWidth: '1px',
    };

    private decorator = window.createTextEditorDecorationType(this.styling);

    public updateStyling(config: WorkspaceConfiguration) {


        window.visibleTextEditors.forEach(editor => {
            editor.setDecorations(this.decorator, []);
        });
        
        if(config && config.has('color') && config.has('width')){            
            this.styling.borderColor = config['color'];
            this.styling.borderSpacing = config['width'];
            this.styling.borderWidth = this.styling.borderSpacing;
            this.decorator = window.createTextEditorDecorationType(this.styling);
        }
    }

    public updateRuler() {

        let editor = window.activeTextEditor;
        if (!editor) {
            return;
        }

        if (editor.selection.isEmpty) {
            var decorations = [];

            for (var i = 0; i < editor.document.lineCount; i++) {
                if (editor.document.lineAt(i).text.length >= editor.selection.end.character) {
                    decorations.push(new Range(i, editor.selection.start.character,
                        i, editor.selection.end.character));
                }
            }

            editor.setDecorations(this.decorator, decorations);
        }
        else {
            editor.setDecorations(this.decorator, []);
        }
    }

    dispose() {
        this.decorator.dispose();
    }
}