import React from 'react';

const areNeighbours = (t1, t2) => {
    const h = Math.abs(t1.x - t2.x);
    const v = Math.abs(t1.y - t2.y);
    const r = h === 0 && v === 1 || h === 1 && v === 0;

    return r;
}

const Tile = ({ focused, crossed, char, x, y, tileid, onMouseDown }) => {
    let dataState;

    if (focused) {
        dataState = 'focused';
    } else if (crossed) {
        dataState = 'crossed'
    } else if (char !== '.') {
        dataState = 'idle'
    } else {
        dataState = 'empty'
    }

    const cssProps = {
        '--x': x,
        '--y': y
    }

    return <div onMouseDown={onMouseDown} style={cssProps} tileid={tileid} className="tile" data-state={dataState}>{char}</div>
}

export class Board extends React.Component {

    state = { focusedTile: undefined }

    startDrag = t => () => {
        const tileid = t.tileid;

        if (tileid != null && t.char !== '.' && !t.crossed) {
            this.setState({ focusedTile: tileid });
        }
    }

    endDrag = ev => {
        this.setState({ focusedTile: undefined })
    }

    checkForTileMove = ev => {
        const sourceTile = this.props.tileData.find(t => t.tileid === this.state.focusedTile);
        const targetTile = this.props.tileData.find(t => t.tileid === Number.parseInt(ev.target.getAttribute('tileid')));
        const tilesDefined = sourceTile && targetTile;
        const tilesDiffer = tilesDefined && sourceTile !== targetTile;
        const sourceIsWordChar = tilesDiffer && sourceTile.char !== '.';
        const targetIsBlank = tilesDiffer && targetTile.char === '.';
        const neighbours = sourceIsWordChar && targetIsBlank && areNeighbours(sourceTile, targetTile)

        if (neighbours) {
            this.props.swapTiles(sourceTile.tileid, targetTile.tileid);
        }
    } 

    componentWillMount() {
        document.addEventListener('mouseup', this.endDrag)
        document.addEventListener('mousemove', this.checkForTileMove)
    }

    render() {
        const tiles = this.props.tileData.map((t, ix) => {
            const focused = t.tileid === this.state.focusedTile;
            return <Tile onMouseDown={this.startDrag(t)} key={ix} {...{...t, focused}}></Tile>
        });

        return (
            <div className="board">
                {tiles}
            </div>
        )
    }
}