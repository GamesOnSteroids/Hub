"use strict";

import ClientLobby = Play.ClientLobby;
import MinesweeperGame = Minesweeper.Game.MinesweeperGame;

class MinesweeperScore extends React.Component<{players: PlayerInfo[], mines: number}, any> {
    render() {
        var totalFlags:number = 0;
        for (let player of this.props.players) {
            totalFlags += player.gameData.flags;
        }

        return (
            <div>
                <div>{totalFlags} / {this.props.mines}</div>
                {this.props.players.map(p=>{
                    return <div key={p.id}>{p.name}: {p.gameData.score}</div>
                    })}
            </div>)
    }
}

class MinesweeperApp extends React.Component<any, any> {

    constructor() {
        super();

        this.state = {
            players: ClientLobby.current.players
        }
    }

    componentDidMount() {
        console.log("MinesweeperApp.componentDidMount");

        let game:any = ClientLobby.current.game;

        game.initialize();

        game.changeListener = (game: MinesweeperGame) => {
            console.log("MinesweeperApp.changeListener");
            this.setState({
                players: ClientLobby.current.players
            })
        }
    }

    render() {
        return (
            <div style={{position: "relative", textAlign: "center"}}>
                <MinesweeperScore players={this.state.players}
                                  mines={ClientLobby.current.configuration.mines}/>
                <canvas id="game-canvas"/>
            </div>
        );
    }
}