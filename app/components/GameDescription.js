"use strict";
class GameDescription extends React.Component {
    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }
    render() {
        let gameCount;
        if (this.props.gameCount == null) {
            gameCount = "No games";
        }
        else if (this.props.gameCount == 1) {
            gameCount = "1 game";
        }
        else {
            gameCount = `${this.props.gameCount} games`;
        }
        return (React.createElement("div", {style: { padding: "5px" }}, React.createElement("h3", {style: { backgroundColor: "#eee", padding: "0" }, className: "text-center"}, this.props.gameConfiguration.name), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-4"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement("img", {className: "img-responsive img-thumbnail", src: "app/games/" + this.props.gameConfiguration.id + "/assets/images/logo.png"})), React.createElement("div", {className: "col-md-12"}, React.createElement("span", null, React.createElement("b", null, gameCount), " being played")))), React.createElement("div", {className: "col-md-6"}, React.createElement("div", {className: "btn-group-vertical", role: "group"}, this.props.gameConfiguration.variants
            .filter((v) => v.development != true || environment == EnvironmentType.Development)
            .map((variant) => (React.createElement("button", {key: variant.id, type: "button", className: variant.id == "default" ? "btn btn-primary" : "btn btn-default", onClick: this.startGame.bind(this, variant)}, variant.name))))))));
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
