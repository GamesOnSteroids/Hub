namespace Tetrominoes.Client {
    "use strict";

    import ClientLobby = Play.Client.ClientLobby;


    export class TetrominoesApp extends React.Component<any, {players: PlayerInfo<any>[], level: number}> {
        private stateChangeToken: number;

        constructor() {
            super();

            let game = ClientLobby.current.game as TetrominoesGame;

            this.state = {
                players: ClientLobby.current.players,
                level: game.playfield.level
            };
        }

        protected componentDidMount(): void {
            console.log("TetrominoesApp.componentDidMount");

            let game = ClientLobby.current.game as TetrominoesGame;
            game.initialize();

            this.stateChangeToken = game.changeListener.register((g: TetrominoesGame) => {
                console.log("TetrominoesApp.changeListener");
                this.setState({
                    players: ClientLobby.current.players,
                    level: game.playfield.level
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
                            <TetrominoesScore players={this.state.players} level={this.state.level} />
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