module Chess.Client {
    "use strict";

    import ClientLobby = Play.Client.ClientLobby;


    export class ChessApp extends React.Component<any, {players: PlayerInfo[]}> {
        private stateChangeToken:number;

        constructor() {
            super();

            let game = ClientLobby.current.game as ChessGame;

            this.state = {
                players: ClientLobby.current.players,
            }
        }

        componentDidMount() {
            console.log("ChessApp.componentDidMount");

            let game = ClientLobby.current.game as ChessGame;

            game.initialize();

            this.stateChangeToken = game.changeListener.register( (game:ChessGame) => {
                console.log("ChessApp.changeListener");
                this.setState({
                    players: ClientLobby.current.players
                })
            });
        }

        componentWillUnmount() {
            let game = ClientLobby.current.game as ChessGame;
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