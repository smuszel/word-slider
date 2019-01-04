import React from 'react';
import ReactDOM from 'react-dom';
import { Game } from './Game';

const config2 = {
    rows: [
        // 'r.klh.aa',
        // 'dnu.s..s',
        // '.botefe.',
        // 'zaeh.c..',
        // 'n.m.a..i',
        // 'ue.ea..v',
        // '.it.f.tt',
        // 'ee.o.xwr'
        'r.klh.aa',
        'dnu.s..s',
        '.botefe.',
        'zaeh.c..',
        'n.m.a..i',
        're.ea..v',
        '.it.f.tt',
        '..xaw...'
    ],
    wordsToCross: [
        'shaken',
        'wax',
        'centre',
        'maze',
        'abrade',
        'halt',
        'fate'
    ]
}

class App extends React.Component {

    render() {
        return <Game {...config2}></Game>
    }
}

ReactDOM.render(<App></App>, document.querySelector('#root'));
