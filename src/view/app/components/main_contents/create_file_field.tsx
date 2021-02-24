import * as React from 'react';
import { editorAction } from '../../../../consts/editor_action';
import { vscode } from '../../declare/vscode';

declare const vscode: vscode;

export default class CreateFileField extends React.Component<{}, {}> {
    constructor(props) {
        super(props);
    }

    createFile() {
        vscode.postMessage({
            action: editorAction.fileCreation
        });
    }

    render() {
        return (
            <div className="create_file_field">
                <button onClick={() => this.createFile()}>ファイル作成</button>
            </div>
        );
    }
}
