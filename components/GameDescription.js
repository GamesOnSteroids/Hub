"use strict";
class GameDescription extends React.Component {
    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }
    static resolveClass(name) {
        let result = window;
        for (let part of name.split(".")) {
            result = result[part];
        }
        if (result == null) {
            throw `Class: ${name} not found`;
        }
        return result;
    }
    componentDidMount() {
    }
    startGame(configuration) {
        console.log("GameDescription.startGame", configuration);
        let lobbyConfiguration = new Play.LobbyConfiguration();
        lobbyConfiguration.maxPlayers = configuration.maxPlayers;
        lobbyConfiguration.gameConfiguration = configuration;
        lobbyConfiguration.gameId = this.props.game.id;
        lobbyConfiguration.appClass = GameDescription.resolveClass(this.props.game.appClass);
        lobbyConfiguration.gameClass = GameDescription.resolveClass(this.props.game.gameClass);
        lobbyConfiguration.serviceClass = GameDescription.resolveClass(this.props.game.serviceClass);
        let lobbyService = new Play.FirebaseLobbyService();
        lobbyService.findLobby(lobbyConfiguration).then((lobby) => {
            Play.Client.ClientLobby.current = lobby;
            ReactRouter.hashHistory.pushState(null, `/lobby/${lobby.lobbyId}`);
        });
    }
    render() {
        return (React.createElement("div", null, React.createElement("h3", null, this.props.game.name), React.createElement("div", null, React.createElement("p", null, this.props.game.description), React.createElement("span", null, "Currently playing: ? games")), React.createElement("div", {"className": "btn-group-vertical", "role": "group"}, this.props.game.configurations.map((configuration) => (React.createElement("button", {"key": configuration.id, "type": "button", "className": configuration.id == "default" ? "btn btn-primary" : "btn btn-default", "onClick": this.startGame.bind(this, configuration)}, configuration.name))))));
    }
}
//# sourceMappingURL=GameDescription.js.map