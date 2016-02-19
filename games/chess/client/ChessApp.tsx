module Minesweeper.Client {
    "use strict";

    import ClientLobby = Play.Client.ClientLobby;


    export class MinesweeperApp extends React.Component<any, {players: PlayerInfo[], remainingMines: number}> {
        private stateChangeToken:number;

        constructor() {
            super();

            let game = ClientLobby.current.game as MinesweeperGame;

            this.state = {
                players: ClientLobby.current.players,
                remainingMines: game.remainingMines
            }
        }

        componentDidMount() {
            console.log("MinesweeperApp.componentDidMount");

            let game = ClientLobby.current.game as MinesweeperGame;

            game.initialize();

            this.stateChangeToken = game.changeListener.register( (game:MinesweeperGame) => {
                console.log("MinesweeperApp.changeListener");
                this.setState({
                    players: ClientLobby.current.players,
                    remainingMines: game.remainingMines
                })
            });
        }
        componentWillUnmount() {
            let game = ClientLobby.current.game as MinesweeperGame;
            game.changeListener.unregister(this.stateChangeToken);

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