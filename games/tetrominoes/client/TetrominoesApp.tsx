namespace Tetrominoes.Client {
    "use strict";

    import ClientLobby = Play.Client.ClientLobby;


    export class TetrominoesApp extends React.Component<any, {players: PlayerInfo[]}> {
        private stateChangeToken: number;

        constructor() {
            super();

            // let game = ClientLobby.current.game as MahjongGame;

            this.state = {
                players: ClientLobby.current.players,
            };
        }

        protected componentDidMount() {
            console.log("TetrominoesApp.componentDidMount");

            let game = ClientLobby.current.game as TetrominoesGame;
            game.initialize();

            this.stateChangeToken = game.changeListener.register((g: TetrominoesGame) => {
                console.log("TetrominoesApp.changeListener");
                this.setState({
                    players: ClientLobby.current.players
                });
            });
        }

        protected componentWillUnmount(): void {
            let game = ClientLobby.current.game as TetrominoesGame;
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