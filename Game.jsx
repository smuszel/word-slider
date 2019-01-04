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

    state = {
        chars: [],
        words: [],
        levelId: undefined
    }

    componentWillMount() {
        this.nextLevel(0);
    }
    
    nextLevel(levelId = this.state.levelId + 1) {
        const level = this.props.levels[levelId];
        const words_ = level.words.map(word => ({ word, crossed: false }));
        const levelChars = level.rows.flatMap(row => row.split(''));
        const chars_ = levelChars.map((char, ix) => ({ char, ix, tileid: ix + 1 }));
        const edge = Math.sqrt(chars_.length);

        const { chars, words } = this.updateCrossings(words_, chars_);

        this.setState({ chars, words, edge, levelId });
    }

    updateCrossings(words, chars) {
        const sortByIx = xs => xs.slice().sort((x1, x2) => x1.ix > x2.ix ? 1 : -1);
        const charsHorizontally = sortByIx(chars);
        const charsVertically = sortByIx(transpose(charsHorizontally).map((c, ix) => ({ ...c, ix })));

        const horizontalWordBlocks = wordBlocks(charsHorizontally);
        const verticalWordBlocks = wordBlocks(charsVertically);
        const totalWordBlocks = [...horizontalWordBlocks, ...verticalWordBlocks];

        const getCrossInfo = block => {
            let crossStart
            let crossedWord

            words.map(wObj => wObj.word).forEach(word => {
                const rev = word.split('').reverse().join('');
                const revCrossStartIx = block.word.indexOf(rev);
                const crossStartIx = block.word.indexOf(word);

                if (crossStartIx > -1) {
                    crossedWord = word
                    crossStart = crossStartIx;
                } else if (revCrossStartIx > -1) {
                    crossedWord = word
                    crossStart = revCrossStartIx;
                }
            });

            if (crossStart != null) {
                const crossEnd = crossStart + crossedWord.length
                const tileids = block.tileids.filter((_, ix) => ix >= crossStart && ix < crossEnd);
                return { crossedWord, tileids };
            }
        }

        const crossedBlocks = totalWordBlocks.map(getCrossInfo).filter(i => i);
        const crossedTileIds = crossedBlocks.flatMap(i => i.tileids);
        const crossedWords = crossedBlocks.map(i => i.crossedWord);
        const edge = Math.sqrt(chars.length);

        chars = charsHorizontally.map((c, ix) => ({
            tileid: c.tileid,
            char: c.char,
            crossed: crossedTileIds.includes(c.tileid),
            x: ixToCoord(edge, ix)[0],
            y: ixToCoord(edge, ix)[1],
            ix
        }));

        words = words.map(wordObj => ({
            word: wordObj.word,
            crossed: crossedWords.includes(wordObj.word)
        }));

        return { words, chars };
    }

    swapTiles = (source, target) => {
        const oldChars = this.state.chars.slice();
        const nextSource = { ...source };
        const nextTarget = { ...target };
        nextSource.ix = target.ix;
        nextTarget.ix = source.ix;
        const p = c => c.tileid !== nextSource.tileid && c.tileid !== nextTarget.tileid;
        const chars_ = oldChars.filter(p);
        chars_.push(nextSource);
        chars_.push(nextTarget);

        const { words, chars } = this.updateCrossings(this.state.words, chars_);

        if (words.every(w => w.crossed)) {
            this.nextLevel();
        } else {
            this.setState({ ...this.state, chars, words })
        }
    }

    render() {
        const edge = Math.sqrt(this.state.chars.length)
        const cssProps = { '--edge': edge };

        return (
            <div className="game" style={cssProps} >
                <Board tileData={this.state.chars} swapTiles={this.swapTiles}></Board>
                <WordList wordList={this.state.words}></WordList>
            </div>
        )
    }
}