import * as React from 'react';
import Message from './message';

export default class Messages extends React.Component<{}, MessagesType> {
    constructor(props) {
        super(props);

        this.state = { messages: [] };
        // superの外に出す＋関数化の必要性？？？
        window.addEventListener('message', e => {
            this.setState({ messages: e.data.messages });
        });
    }

    render() {
        return (
            <div id="messages">
                <p>message test</p>
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