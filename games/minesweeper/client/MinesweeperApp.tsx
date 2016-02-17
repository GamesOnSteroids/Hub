module Minesweeper.Client {
    "use strict";

    import ClientLobby = Play.Client.ClientLobby;


    export class MinesweeperApp extends React.Component<any, {players: PlayerInfo[], remainingMines: number}> {

        constructor() {
            super();

            let game:any = ClientLobby.current.game;

            this.state = {
                players: ClientLobby.current.players,
                remainingMines: game.remainingMines
            }
        }

        componentDidMount() {
            console.log("MinesweeperApp.componentDidMount");

            let game:any = ClientLobby.current.game;

            game.initialize();

            game.changeListener = (game:MinesweeperGame) => {
                console.log("MinesweeperApp.changeListener");
                this.setState({
                    players: ClientLobby.current.players,
                    remainingMines: game.remainingMines
                })
            }
        }

        render() {
            return (
                <div style={{position: "relative", textAlign: "center"}}>
                    <div className="row">
                        <div className="col-xs-12 col-md-8">
                            <canvas id="game-canvas"/>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <MinesweeperScore players={this.state.players}
                                              remainingMines={this.state.remainingMines}/>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <Chat/>
                        </div>
                    </div>
                </div>
            );
        }
    }
}