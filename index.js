import React from 'react';
import ReactDOM from 'react-dom';
import { Game } from './Game';

const levels = [
    {
        rows: [
            'm.p',
            '...',
            '.a.'
        ],
        words: [
            'map'
        ]
    },
    {
        rows: [
            'r.klh.aa',
            'dnu.s..s',
            '.botefe.',
            'zaeh.c..',
            'n.m.a..i',
            're.ea..v',
            '.it.f.tt',
            '..xa.w..'
        ],
        words: [
            'shaken',
            'wax',
            'centre',
            'maze',
            'abrade',
            'halt',
            'fate'
        ]
    }
]

class App extends React.Component {

    render() {
        return <Game levels={levels}></Game>
    }
}

ReactDOM.render(<App></App>, document.querySelector('#root'));
