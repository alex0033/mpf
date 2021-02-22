import * as React from 'react';
import Header from './header';
import Footer from './footer';
import Messages from './messages';
import CreateProgectField from './main_contents/create_progect_field'
import { PathInfo } from '../consts/types';
import { View } from '../consts/types';

export default class Main extends React.Component<{}, StateType> {
    constructor(props) {
        super(props);

        this.state = {
            pathInfoType: PathInfo.yyy,
            viewType: View.types.ErrorField,
            // progectMemos: [],
            // fileMemos: []
        };

        // superの外に出す＋関数化の必要性？？？
        window.addEventListener('message', event => {
            const data = event.data;
            const pathInfoType = data.pathInfoType;
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
            case PathInfo.nnn:
                return View.types.CreateProgectField;
            case PathInfo.ynn: 
                return View.types.CreateFileField;
            case PathInfo.yyn:
                return View.types.ProgectMemos;
            case PathInfo.yyy:
                return View.types.FileMemos;
            default:
                return View.types.ErrorField;
        }
    }

    render() {
        let mainContent = <Messages/>;
        // 原因はポストからのここ
        switch (this.state.viewType) {
            case View.types.CreateProgectField:
                mainContent = <CreateProgectField/>;
                break;
            // case View.types.CreateFileField:
            //     mainContent = <CreateFileField/>;
            //     break;
            // case View.types.ProgectMemos:
            //     mainContent = <ProgectMemos/>;
            //     break;
            // case View.types.FileMemos:
            //     mainContent = <FileMemos/>;
            //     break;
            default:
                // mainContent = <ErrorFiled/>;
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