import * as React from 'react';
import Message from './Message';

export default class Messages extends React.Component<{}, MessagesType> {
    constructor(props) {
        super(props);

        this.state = { messages: [] };
        // superの外に出す＋関数化の必要性？？？
        window.addEventListener('message', e => {
            this.setState({ messages: e.data.messages });
        });
    }

    // messageタグ？？
    // 配列を順番に表示させるのはどう表現する？？
    render() {
        return (
            <div id="messages">
                {this.state.messages.map((message)=>{
                    return(
                        <Message
                            message={message}
                        />
                    );
                })}
            </div>
        );
    }
}

interface MessagesType {
    messages: string[];
}