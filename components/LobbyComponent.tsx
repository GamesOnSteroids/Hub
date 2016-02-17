"use strict";
import LobbyState = Play.Client.LobbyState;
import PlayerInfo = Play.Client.PlayerInfo;
import ClientLobby = Play.Client.ClientLobby;


class GameOver extends React.Component<any, any> {

    render() {
        var overlayStyle = {
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0,
            top: 0,
            background: "rgba(1,1,1,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            textAlign: "center"
        };
        return (
            <div style={overlayStyle}>
                <div>
                    <h2>GAME OVER</h2>
                    <br/>
                    <button className="btn btn-default" type="submit" onClick={this.props.onBackToLobby}>Back to Lobby
                    </button>
                </div>
            </div>
        )
    }
}

class PlayerInfoComponent extends React.Component<{key:string, player:PlayerInfo}, any> {
    render() {
        return <div>{this.props.player.name}</div>
    }
}
class PlayerList extends React.Component<{players: PlayerInfo[]}, any> {
    render() {
        return <div>
            {this.props.players.map( (player: PlayerInfo) => {
                return <PlayerInfoComponent key={player.id} player={player}/>
                })}
        </div>
    }
}

class LobbyComponent extends React.Component<any, {state: LobbyState, players: PlayerInfo[]}> {

    constructor() {
        super();
        var lobby = ClientLobby.current;
        this.state = {state: lobby.state, players: lobby.players};

        lobby.changeListener.register( (lobby, completed) => {
            console.log("LobbyComponent.changeListener");
            this.setState({state: lobby.state, players: lobby.players}, completed);
        });
    }

    backToLobby() {
        console.log("LobbyComponent.backToLobby");
        ClientLobby.current.backToLobby();
    }

    render():JSX.Element {
        if (this.state.state == LobbyState.IN_LOBBY) {
            return (
                <div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-striped active" role="progressbar"
                                             style={{width: "100%"}}>
                                            <span>Waiting for other players</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <PlayerList players={this.state.players}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <Chat />
                        </div>
                    </div>

                </div>
            )
        } else if (this.state.state == LobbyState.GAME_RUNNING || this.state.state == LobbyState.GAME_OVER) {
            var game = React.createElement(Minesweeper.Client.MinesweeperApp);
            return (<div>
                {game}
                {this.state.state == LobbyState.GAME_OVER?<GameOver onBackToLobby={this.backToLobby}/>:""}
            </div>)
        } else {
            throw "Unknown state";
        }
    }
}
