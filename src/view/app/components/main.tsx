import * as React from 'react';
import Header from './header';
import Footer from './footer';
import Messages from './messages';

export default class Main extends React.Component {
    render() {
        const main = <div>
                <Header/>
                <Messages/>
                <Footer/>
            </div>;
        return main;
    }
}
