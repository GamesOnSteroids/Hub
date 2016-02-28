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

        protected componentDidMount(): void {
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
                            <canvas id="game-canvas" style={{borderImage: 'url("/app/games/tetrominoes/assets/images/border.png") 16 16 repeat' }}/>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <TetrominoesScore players={this.state.players} />
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