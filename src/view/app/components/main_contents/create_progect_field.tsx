import * as React from 'react';

// 下記は共有する？？
interface vscode {
    postMessage(message: any): void;
}
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
        this.setState({
            title: this.state.nowText
        });
        vscode.postMessage({
            action: "createProgect",
            title: this.state.title
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
                <input type="text" value={this.state.nowText}  onChange={(e) => this.handleOnChange(e)}/>
                {/* 下記<br>はみっともないなぁ。改善の余地あり */}
                <br/>
                <br/>
                <button onClick={() => this.createProgect()}>プロジェクト作成</button>
                <p>{this.state.title}</p>
            </div>
        );
    }
}
