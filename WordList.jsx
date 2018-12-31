import React from 'react';

export class WordList extends React.Component {

    render() {
        const words = this.props.wordList.map((w, ix) => (
            <div
                key={ix}
                className="word"
                data-state={w.crossed ? 'crossed' : 'idle'}
            >{w.word}</div>
        ));

        return (
            <div className="word-list">
                {words}
            </div>
        );
    }
}