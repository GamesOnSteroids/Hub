"use strict";
var LobbyState = Play.Client.LobbyState;
var PlayerInfo = Play.Client.PlayerInfo;
var ClientLobby = Play.Client.ClientLobby;
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
        return (React.createElement("div", {style: overlayStyle}, React.createElement("div", null, React.createElement("h2", null, "GAME OVER"), React.createElement("br", null), React.createElement("button", {className: "btn btn-default", type: "submit", onClick: this.props.onBackToLobby}, "Back to Lobby"))));
    }
}
class PlayerInfoComponent extends React.Component {
    render() {
        let teamIcon = `app/games/${ClientLobby.current.configuration.gameConfiguration.id}/assets/images/teams/${this.props.player.team}.png`;
        return (React.createElement("tr", null, React.createElement("td", null, React.createElement("img", {src: teamIcon})), React.createElement("td", null, this.props.player.name), React.createElement("td", null, this.props.player.isReady ? React.createElement("span", {className: "glyphicon glyphicon-ok"}) : "")));
    }
}
class PlayerList extends React.Component {
    render() {
        return (React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("table", {className: "table"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Nickname"), React.createElement("th", null, "Ready?"))), React.createElement("tbody", null, this.props.players.map((player) => {
            return React.createElement(PlayerInfoComponent, {key: player.id, player: player});
        }))))));
    }
}
class LobbyComponent extends React.Component {
    constructor() {
        super();
        console.log("LobbyComponent.constructor");
        let lobby = ClientLobby.current;
        this.state = { state: lobby.state, players: lobby.players };
        this.changeListenerToken = lobby.changeListener.register((lobby, completed) => {
            console.log("LobbyComponent.changeListener");
            this.setState({ state: lobby.state, players: lobby.players }, completed);
        });
    }
    componentWillUnmount() {
        console.log("LobbyComponent.componentWillUnmount");
        let lobby = ClientLobby.current;
        lobby.changeListener.unregister(this.changeListenerToken);
    }
    backToLobby() {
        console.log("LobbyComponent.backToLobby");
        ClientLobby.current.backToLobby();
    }
    render() {
        if (this.state.state == LobbyState.IN_LOBBY) {
            return (React.createElement("div", null, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-8"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement("div", {className: "progress"}, React.createElement("div", {className: "progress-bar progress-bar-striped active", role: "progressbar", style: { width: "100%" }}, React.createElement("span", null, "Waiting for other players"))))), React.createElement("div", null, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement(PlayerList, {players: this.state.players}))))), React.createElement("div", {className: "col-md-4"}, React.createElement(Chat, null)))));
        }
        else if (this.state.state == LobbyState.GAME_RUNNING || this.state.state == LobbyState.GAME_OVER) {
            var app = React.createElement(ClassUtils.resolveClass(ClientLobby.current.configuration.gameConfiguration.appClass));
            return (React.createElement("div", null, app, this.state.state == LobbyState.GAME_OVER ? React.createElement(GameOver, {onBackToLobby: this.backToLobby}) : ""));
        }
        else {
            throw "Unknown state";
        }
    }
}
