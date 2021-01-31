import * as React from 'react';
// import Message from './message';

export default class Messages extends React.Component {
    private messages: string[] = [];

    constructor(props) {
        super(props);
        window.addEventListener('message', e => {
            const element = document.getElementById('ex');
            element.textContent = JSON.stringify(e.data);
            this.messages = e.data;
        });
    }

    render() {
        return <div>
            {this.messages[0]}
        </div>;
    }
}
