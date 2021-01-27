import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './main';

import './index.css';

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);

window.addEventListener('message', e => {
    const element = document.getElementById('ex');
    element.textContent = e.data.messages[0];
});

// useEffectが使えない？？
// React.useEffect(() => {
//     window.addEventListener('message', e => {
//         const element = document.getElementById('ex');
//         element.textContent = e.data.messages[0];
//     });
// });
