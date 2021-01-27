import * as React from 'react';
import Message from './message';

export default class Messages extends React.Component {
    render() {
        return <div>
            <Message/>
            <Message/>
        </div>;
    }
}
