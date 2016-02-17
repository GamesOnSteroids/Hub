"use strict";
var LobbyState = Play.LobbyState;
var PlayerInfo = Play.PlayerInfo;
class GameOver extends React.Component {
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
        return (React.createElement("div", {"style": overlayStyle}, React.createElement("div", null, React.createElement("h2", null, "GAME OVER"), React.createElement("br", null), React.createElement("button", {"className": "btn btn-default", "type": "submit", "onClick": this.props.onBackToLobby}, "Back to Lobby"))));
    }
}
class PlayerInfoComponent extends React.Component {
    render() {
        return React.createElement("div", null, this.props.player.name);
    }
}
class PlayerList extends React.Component {
    render() {
        return React.createElement("div", null, this.props.players.map((player) => {
            return React.createElement(PlayerInfoComponent, {"key": player.id, "player": player});
        }));
    }
}
class LobbyComponent extends React.Component {
    constructor() {
        super();
        var lobby = Play.ClientLobby.current;
        this.state = { state: lobby.state, players: lobby.players };
        lobby.changeListener = (lobby, completed) => {
            this.setState({ state: lobby.state, players: lobby.players }, completed);
        };
    }
    backToLobby() {
        console.log("LobbyComponent.backToLobby");
        Play.ClientLobby.current.backToLobby();
    }
    render() {
        if (this.state.state == LobbyState.IN_LOBBY) {
            return (React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-8"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-12"}, React.createElement("div", {"className": "progress"}, React.createElement("div", {"className": "progress-bar progress-bar-striped active", "role": "progressbar", "style": { width: "100%" }}, React.createElement("span", null, "Waiting for other players"))))), React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-12"}, React.createElement(PlayerList, {"players": this.state.players}))))), React.createElement("div", {"className": "col-md-4"}, React.createElement(Chat, null)))));
        }
        else if (this.state.state == LobbyState.GAME_RUNNING || this.state.state == LobbyState.GAME_OVER) {
            var game = React.createElement(MinesweeperApp);
            return (React.createElement("div", null, game, this.state.state == LobbyState.GAME_OVER ? React.createElement(GameOver, {"onBackToLobby": this.backToLobby}) : ""));
        }
        else {
            throw "Unknown state";
        }
    }
}
//# sourceMappingURL=lobbycomponent.js.map