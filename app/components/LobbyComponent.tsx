"use strict";

import LobbyState = Play.Client.LobbyState;
import PlayerInfo = Play.Client.PlayerInfo;
import ClientLobby = Play.Client.ClientLobby;
import LobbyConfiguration = Play.LobbyConfiguration;
import ServerLobby = Play.Server.ServerLobby;


class PlayerInfoComponent extends React.Component<{key: string, player: PlayerInfo<any>}, any> {
    public render(): JSX.Element {
        let teamIcon = `app/games/${ClientLobby.current.configuration.gameConfiguration.id}/assets/images/teams/${this.props.player.team}.png`;
        return (
            <tr>
                <td>
                    <img src={teamIcon}/>
                </td>
                <td>{this.props.player.name}</td>
                <td>{this.props.player.isReady ? <span className="glyphicon glyphicon-ok"/> : ""}</td>
            </tr>
        );
    }
}
class PlayerList extends React.Component<{players: PlayerInfo<any>[]}, any> {
    public render(): JSX.Element {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nickname</th>
                                <th>Ready?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.players.map( (player: PlayerInfo<any>) => {
                                return <PlayerInfoComponent key={player.id} player={player}/>;
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

class LobbyComponent extends React.Component<any, {state: LobbyState, players: PlayerInfo<any>[]}> {

    private changeListenerToken: number;

    public static onLeave(): void {

    }

    public static onEnter(nextState: ReactRouter.RouterState, replaceState: ReactRouter.RedirectFunction, callback?: Function): any {
        if (ClientLobby.current == null) {
            let configuration = new LobbyConfiguration();
            configuration.lobbyId = nextState.params["lobbyId"];
            new FirebaseLobbyService().findLobby(configuration).then((lobby) => {
                Play.Client.ClientLobby.current = lobby;

                callback();
            });
        } else {
            callback();
        }
    }

    constructor() {
        super();
        console.log("LobbyComponent.constructor");
        let lobby = ClientLobby.current;

        this.state = {state: lobby.state, players: lobby.players};

        this.changeListenerToken = lobby.changeListener.register((lobby, completed) => {
            console.log("LobbyComponent.changeListener");
            this.setState({state: lobby.state, players: lobby.players}, completed);
        });
    };


    protected componentWillUnmount(): void {
        console.log("LobbyComponent.componentWillUnmount");
        let lobby = ClientLobby.current;
        lobby.changeListener.unregister(this.changeListenerToken);
        Firebase.goOffline(); //TODO: this should not be here
        ClientLobby.current.leave();
        if (ServerLobby.current != null) {
            ServerLobby.current.destroy();
            ServerLobby.current = null;
        }
    }

    private backToLobby(): void {
        console.log("LobbyComponent.backToLobby");
        let lobby = ClientLobby.current;
        if (lobby.players.length < lobby.configuration.variant.maxPlayers) {
            ReactRouter.hashHistory.pushState(null, "/");
        } else {
            ClientLobby.current.backToLobby();
        }
    }

    public render(): JSX.Element {
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
            );
        } else if (this.state.state == LobbyState.GAME_RUNNING || this.state.state == LobbyState.GAME_OVER) {
            var app = React.createElement(ClassUtils.resolveClass<React.Component<any, any>>(ClientLobby.current.configuration.gameConfiguration.appClass));
            return (
                <div>
                    {app}
                    {this.state.state == LobbyState.GAME_OVER ? <GameOver onBackToLobby={this.backToLobby}/> : ""}
                </div>
            );
        } else {
            throw "Unknown state";
        }
    }
}
