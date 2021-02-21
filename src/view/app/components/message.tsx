import * as React from 'react';

export default class Messages extends React.Component<PropsType, {}> {
    render() {
        return (
            <div className="message">
                <p style={{color: "red"}}>messages</p>
            </div>
        );
    }
}

interface PropsType {
    message: string;
}