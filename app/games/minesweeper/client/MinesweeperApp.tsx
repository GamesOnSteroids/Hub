namespace Minesweeper.Client {
    "use strict";

    import ClientLobby = Play.Client.ClientLobby;


    export class MinesweeperApp extends React.Component<any, {players: PlayerInfo<IMinesweeperPlayer>[], remainingMines: number}> {
        private stateChangeToken: number;

        constructor() {
            super();

            let game = ClientLobby.current.game as MinesweeperGame;

            this.state = {
                players: ClientLobby.current.players,
                remainingMines: game.remainingMines,
            };
        }

        protected componentDidMount(): void {
            console.log("MinesweeperApp.componentDidMount");

            let game = ClientLobby.current.game as MinesweeperGame;
            game.initialize();

            this.stateChangeToken = game.changeListener.register((g: MinesweeperGame) => {
                console.log("MinesweeperApp.changeListener");
                this.setState({
                    players: ClientLobby.current.players,
                    remainingMines: g.remainingMines,
                });
            });
        }

        protected componentWillUnmount(): void {
            let game = ClientLobby.current.game as MinesweeperGame;
            game.changeListener.unregister(this.stateChangeToken);

        }

        public render(): JSX.Element {
            return (
                <div style={{position: "relative", textAlign: "center"}}>
                    <div className="row">
                        <div className="col-xs-12 col-md-8">
                            <canvas id="game-canvas"/>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <Minesweeper.Client.MinesweeperScore players={this.state.players}
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