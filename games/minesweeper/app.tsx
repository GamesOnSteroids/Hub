"use strict";

import ClientLobby = Play.ClientLobby;

class MinesweeperApp extends React.Component<any, any> {

    constructor() {
        super();

        this.state = {isGameOver: false};
    }

    componentDidMount() {
        console.log("MinesweeperApp.componentDidMount");
        ClientLobby.current.game = new Minesweeper.Game.MinesweeperGame(ClientLobby.current, ClientLobby.current.configuration);
    }

    render() {
        return (
            <div style={{position: "relative", textAlign: "center"}}>
                <h3>Minesweeper</h3>
                <canvas id="game-canvas"/>

            </div>
        );
    }
}