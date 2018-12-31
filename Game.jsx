import React from 'react';
import { Board } from "./Board";
import { WordList } from "./WordList";

const ixToCoord = (edge, ix) => {
    const x = ix % edge;
    const y = Math.floor(ix / edge);

    return [x, y];
}

const transpose = array => {
    const n = Math.sqrt(array.length);
    const nArr = array.slice();
    const transposed = nArr.map((_, i, a) => a[(i % n) * n + Math.floor(i / n)]);

    return transposed;
}

const wordBlocks = chars => {
    let prevChar;
    const edge = Math.sqrt(chars.length);
    const temp = [[]];

    for (let index = 0; index < chars.length; index++) {
        const charObj = chars[index];
        const breakBlock = prevChar === '.' || charObj.ix % edge === 0;
        const wordChar = charObj.char !== '.';
        
        if (wordChar && breakBlock) {
            temp.push([charObj]);
        } else if (wordChar) {
            const lastWordBuild = temp[temp.length - 1];
            
            lastWordBuild.push(charObj);
        } else {
            temp.push([]);
        }

        prevChar = charObj.char
    }

    const wordBlocks = temp.map(block => ({
        word: block.map(c => c.char).join(''),
        tileids: block.map(c => c.tileid)
    }));

    return wordBlocks;
};

export class Game extends React.Component {

    edge = undefined;

    state = {
        chars: []
    }

    componentWillMount() {
        const unpreppedChars = this.props.rows.flatMap(row => row.split(''));
        this.state.chars = unpreppedChars.map((char, ix) => ({ char, ix, tileid: ix + 1 }));
        this.edge = Math.sqrt(unpreppedChars.length);
    }

    swapTiles = (aId, bId) => {
        const chars = this.state.chars.slice();
        const aIx = chars[aId - 1].ix;
        chars[aId - 1] = { ...chars[aId - 1], ix: chars[bId - 1].ix };
        chars[bId - 1] = { ...chars[bId - 1], ix: aIx };

        this.setState({ chars })
    }

    render() {
        const gameInfo = this.gameInfo;
        const cssProps = { '--edge': this.edge };
        
        return (
            <div className="game" style={cssProps} >
                <Board tileData={gameInfo.tileData} swapTiles={this.swapTiles}></Board>
                <WordList wordList={gameInfo.wordList}></WordList>
            </div>
        )
    }

    // Bug: 'abc' in 'abcd'
    get gameInfo() {
        const sortByIx = xs => xs.slice().sort((x1, x2) => x1.ix > x2.ix ? 1 : -1);
        const charsHorizontally = sortByIx(this.state.chars);
        const charsVertically = sortByIx(transpose(charsHorizontally).map((c, ix) => ({ ...c, ix })));
        
        const horizontalWordBlocks = wordBlocks(charsHorizontally);
        const verticalWordBlocks = wordBlocks(charsVertically);
        const totalWordBlocks = [...horizontalWordBlocks, ...verticalWordBlocks];

        const getCrossInfo = wordsToCross => block => {
            const norm = block.word;
            const rev = norm.split('').reverse().join('');

            if (norm) {
                const n = wordsToCross.find(w => w === norm);
                const r = wordsToCross.find(w => w === rev);
                const tileids = block.tileids;
                const crossedWord = n || r;
    
                return crossedWord && { crossedWord, tileids };
            }
        }

        const x = this.props.wordsToCross.slice();
        const crossedBlocks = totalWordBlocks.map(getCrossInfo(x)).filter(i => i);
        const crossedTileIds = crossedBlocks.flatMap(i => i.tileids);
        const crossedWords = crossedBlocks.map(i => i.crossedWord);

        const tileData = charsHorizontally.map(c => ({
            tileid: c.tileid,
            char: c.char,
            crossed: crossedTileIds.includes(c.tileid),
            x: ixToCoord(this.edge, c.ix)[0],
            y: ixToCoord(this.edge, c.ix)[1]
        }));

        const wordList = this.props.wordsToCross.map(word => ({
            word,
            crossed: crossedWords.includes(word)
        }));
        
        return { tileData, wordList };
    }
}