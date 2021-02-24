import * as React from 'react';
import Header from './header';
import Footer from './footer';
import Messages from './messages';
import CreateProgectField from './main_contents/create_progect_field';
import { View, PathInfo } from '../../../consts/types';
import { editorAction } from '../../../consts/editor_action';

interface vscode {
    postMessage(message: any): void;
}
declare const vscode: vscode;

export default class Main extends React.Component<{}, StateType> {
    // ビューを切り替えると、このクラスのインスタンスが再度生成される
    // 注意点として、このときstateの値も初期化される
    // 解決策として、
    // ①コンストラクタ内でvscodeと同期通信するコードを書く
    // ②前回のstateを引き継ぐ方法はないのか確認
    // ③vscodeAPI参照（②とかぶるかもしれない）
    constructor(props) {
        super(props);

        this.state = {
            pathInfoType: PathInfo.types.yyy,
            viewType: View.types.ErrorField,
            // progectMemos: [],
            // fileMemos: []
        };

        // ViewLoaderとの通信
        // ViewLoaderとこのコンポーネントが同時にロードされるとは限らない
        // コンポーネント生成とViewLoaderのインスタンス生成が同時に行われるわけではない。
        vscode.postMessage({
            action: editorAction.editorStateTransmission
        });

        this.listenMessage();
    }

    private listenMessage() {
        window.addEventListener('message', event => {
            const data = event.data;
            const pathInfoType: PathInfo.types = data.pathInfoType;
            const viewType = this.getViewType(pathInfoType);
            this.setState({
                pathInfoType: pathInfoType,
                viewType: viewType
                // progectMemos: data.progectMemos,
                // fileMemos: data.fileMemos
            });
        });
    }

    private getViewType(pathInfoType: PathInfo.types): View.types {
        switch(pathInfoType) {
            case PathInfo.types.nnn:
                return View.types.CreateProgectField;
            case PathInfo.types.ynn: 
                return View.types.ProgectMemos;
            case PathInfo.types.yyn:
                return View.types.CreateFileField;
            case PathInfo.types.yyy:
                return View.types.FileMemos;
            default:
                return View.types.ErrorField;
        }
    }

    render() {
        let mainContent = <Messages/>;
        // 原因はポストからのここ
        // break忘れの無限ループ
        // 何もしないのも問題らしい
        // 同じ値を代入しても止まる？？

        // 助長すぎる？？下記のような書き方が出来れば。。
        // <{this.state.viewType}/>
        switch (this.state.viewType) {
            case View.types.CreateProgectField:
                mainContent = <CreateProgectField/>;
                break;
            case View.types.CreateFileField:
                mainContent = <p>CreateFileField</p>;
                // mainContent = <CreateFileField/>;
                break;
            case View.types.ProgectMemos:
                // mainContent = <ProgectMemos/>;
                mainContent = <p>progectMemos</p>;
                break;
            case View.types.FileMemos:
                mainContent = <p>FileMemos</p>;
                // mainContent = <FileMemos/>;
                break;
            default:
                // return <p>here is default of viewType</p>;
                mainContent = <p>{this.state.pathInfoType}</p>;
                break;
        }

        const main = <div>
                <Header/>
                {mainContent}
                <Footer/>
            </div>;
        return main;
    }
}

interface StateType {
    pathInfoType: PathInfo.types
    viewType: View.types
    // progectMemos: Memo[]
    // fileMemos: Memo[]
}

interface Memo {
    title: string
    message: string
}