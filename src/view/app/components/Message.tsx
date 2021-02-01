import * as React from 'react';

export default class Messages extends React.Component<PropsType, {}> {
    constructor(props) {
        super(props);
    }

    // messageタグ？？
    // 配列を順番に表示させるのはどう表現する？？
    render() {
        return (
            <div className="message">
                <p>{this.props.message}</p>
            </div>
        );
    }
}

interface PropsType {
    message: string;
}