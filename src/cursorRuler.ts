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
            let decorations = [],
                beginningTabRegex = /^\t*/,
                tabSize = <number>editor.options.tabSize,
                currentLineText = editor.document.lineAt(editor.selection.start.line).text,
                currentLineBeginningTabsBeforeSel = beginningTabRegex.exec(currentLineText.substr(0, editor.selection.start.character))[0].length,
                currentCol = editor.selection.start.character + currentLineBeginningTabsBeforeSel * (tabSize - 1);
            for (let i = 0; i < editor.document.lineCount; ++i) {
                let text = editor.document.lineAt(i).text,
                    beginningTabs = beginningTabRegex.exec(text)[0].length,
                    decorationCol = currentCol;
                if (decorationCol > beginningTabs * tabSize) {
                    decorationCol -= beginningTabs * (tabSize - 1);
                } else {
                    decorationCol /= tabSize;
                }
                if (text.length >= decorationCol &&
                    (currentCol > beginningTabs * tabSize || currentCol % tabSize == 0))
                {
                    decorations.push(new Range(i, decorationCol, i, decorationCol));
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