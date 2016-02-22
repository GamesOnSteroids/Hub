module Mahjong.Client {
    "use strict";

    import ClientLobby = Play.Client.ClientLobby;


    export class MahjongApp extends React.Component<any, {players: PlayerInfo[]}> {
        private stateChangeToken:number;

        constructor() {
            super();

            let game = ClientLobby.current.game as MahjongGame;

            this.state = {
                players: ClientLobby.current.players
            }
        }

        componentDidMount() {
            console.log("MahjongApp.componentDidMount");

            let game = ClientLobby.current.game as MahjongGame;
            game.initialize();

            this.stateChangeToken = game.changeListener.register( (game:MahjongGame) => {
                console.log("MahjongApp.changeListener");
                this.setState({
                    players: ClientLobby.current.players
                })
            });
        }
        componentWillUnmount() {
            let game = ClientLobby.current.game as MahjongApp;
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