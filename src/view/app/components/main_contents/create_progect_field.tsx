import * as React from 'react';
import { editorAction } from '../../../../consts/editor_action';
import { vscode } from '../../declare/vscode';

declare const vscode: vscode;

export default class CreateProgectField extends React.Component<{}, {title: string, nowText: string}> {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            nowText: ""
        };
    }

    createProgect() {
        // this.state.titleはこの関数内では反映されないことに注意
        const title = this.state.nowText;
        this.setState({
            title: title
        });
        vscode.postMessage({
            action: editorAction.progectCreation,
            title: title
        });
    }

    handleOnChange(e: any) {
        this.setState({
            nowText: e.target.value
        });
    }

    render() {
        return (
            <div className="create_progect_field">
                <input type="text" value={this.state.nowText} onChange={(e) => this.handleOnChange(e)}/>
                {/* 下記<br>はみっともないなぁ。改善の余地あり */}
                <br/>
                <br/>
                <button onClick={() => this.createProgect()}>プロジェクト作成</button>
                <p>{this.state.title}</p>
            </div>
        );
    }
}
