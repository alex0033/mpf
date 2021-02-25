import * as React from 'react';
import { editorAction } from '../../../../consts/editor_action';
import { View } from '../../../../consts/types';
import { Memo } from '../../../../models/memo';
import { vscode } from '../../declare/vscode';

declare const vscode: vscode;

export default class Memos extends React.Component<PropsType, StateType> {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            viewType: props.viewType
        }
    }

    private handleOnChange(e: any) {
        this.setState({text: e.target.value});
    }

    private createMemo() {
        // 後ほど、書く
        if (this.state.viewType == View.types.ProgectMemos) {
            vscode.postMessage({
                action: editorAction.progectMemoCreation,
                message: this.state.text
            });
        } else if (this.state.viewType == View.types.FileMemos) {
            vscode.postMessage({
                action: editorAction.fileMemoCreation,
                message: this.state.text
            });
        } else {
            this.setState({text: `error type: ${this.state.viewType}`})
            return;
        }
        this.setState({text: ""});
    }

    render() {
        return (
            <div className="memos">
                <input type="text" value={this.state.text} onChange={(e) => this.handleOnChange(e)}/>
                <button onClick={() => this.createMemo()}>メモ作成</button>
                <p>{this.state.text}</p>
                {this.props.memos.map((memo) => {
                    return(<p>{memo.message}</p>);
                })}
            </div>
        );
    }
}

interface PropsType {
    viewType: View.types
    memos: Memo[]
}

interface StateType {
    text: string
    viewType: View.types
}
