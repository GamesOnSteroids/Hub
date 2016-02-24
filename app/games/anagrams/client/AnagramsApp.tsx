namespace Anagrams.Client {
    "use strict";

    import ClientLobby = Play.Client.ClientLobby;


    export class AnagramsApp extends React.Component<any, {players: PlayerInfo[]}> {
        private stateChangeToken: number;

        constructor() {
            super();

            let game = ClientLobby.current.game as AnagramsGame;

            this.state = {
                players: ClientLobby.current.players,
            }
        }

        componentDidMount() {
            console.log("AnagramsApp.componentDidMount");

            let game = ClientLobby.current.game as AnagramsGame;
            game.initialize();

            this.stateChangeToken = game.changeListener.register((game: AnagramsGame) => {
                console.log("AnagramsApp.changeListener");
                this.setState({
                    players: ClientLobby.current.players
                })
            });
        }

        componentWillUnmount() {
            let game = ClientLobby.current.game as AnagramsGame;
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