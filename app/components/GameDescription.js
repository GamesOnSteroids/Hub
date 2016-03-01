"use strict";
class GameDescription extends React.Component {
    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }
    render() {
        return (React.createElement("div", {style: { padding: "5px" }}, React.createElement("h3", {style: { backgroundColor: "#eee", padding: "0" }, className: "text-center"}, this.props.gameConfiguration.name), React.createElement("div", null, React.createElement("div", {className: "pull-left"}, React.createElement("img", {width: "128", src: "app/games/" + this.props.gameConfiguration.id + "/assets/images/logo.png"})), React.createElement("div", {className: "pull-right"}, React.createElement("div", {className: "btn-group-vertical", role: "group"}, this.props.gameConfiguration.variants
            .filter((v) => v.development != true || environment == EnvironmentType.Development)
            .map((variant) => (React.createElement("button", {key: variant.id, type: "button", className: variant.id == "default" ? "btn btn-primary" : "btn btn-default", onClick: this.startGame.bind(this, variant)}, variant.name)))))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement("span", null, "Currently playing: ? games")))));
    }
    componentDidMount() {
        if (environment == EnvironmentType.Development) {
            if (this.props.gameConfiguration.id == "tetrominoes") {
            }
        }
    }
    startGame(variant) {
        console.log("GameDescription.startGame", variant);
        let lobbyConfiguration = new Play.LobbyConfiguration();
        lobbyConfiguration.variant = variant;
        lobbyConfiguration.gameConfiguration = this.props.gameConfiguration;
        let lobbyService = new Play.FirebaseLobbyService();
        lobbyService.findLobby(lobbyConfiguration).then((lobby) => {
            Play.Client.ClientLobby.current = lobby;
            ReactRouter.hashHistory.pushState(undefined, `/lobby/${lobby.lobbyId}`);
        });
    }
}
