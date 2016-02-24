"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
class GameDescription extends React.Component {
    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }
    render() {
        return (React.createElement("div", null, React.createElement("h3", null, this.props.game.name), React.createElement("div", null, React.createElement("p", null, this.props.game.description), React.createElement("span", null, "Currently playing: ? games")), React.createElement("div", {"className": "btn-group-vertical", "role": "group"}, this.props.game.variants
            .filter((v) => v.development != true || environment == EnvironmentType.Development)
            .map((variant) => (React.createElement("button", {"key": variant.id, "type": "button", "className": variant.id == "default" ? "btn btn-primary" : "btn btn-default", "onClick": this.startGame.bind(this, variant)}, variant.name))))));
    }
    componentDidMount() {
        if (environment == EnvironmentType.Development) {
            if (this.props.game.id == "mahjong") {
                this.startGame(this.props.game.variants[0]);
            }
        }
    }
    startGame(variant) {
        console.log("GameDescription.startGame", variant);
        let lobbyConfiguration = new Play.LobbyConfiguration();
        lobbyConfiguration.maxPlayers = variant.maxPlayers;
        lobbyConfiguration.gameConfiguration = variant;
        lobbyConfiguration.gameId = this.props.game.id;
        lobbyConfiguration.appClass = ClassUtils.resolveClass(this.props.game.appClass);
        lobbyConfiguration.gameClass = ClassUtils.resolveClass(this.props.game.gameClass);
        lobbyConfiguration.serviceClass = ClassUtils.resolveClass(this.props.game.serviceClass);
        let lobbyService = new Play.FirebaseLobbyService();
        lobbyService.findLobby(lobbyConfiguration).then((lobby) => {
            Play.Client.ClientLobby.current = lobby;
            ReactRouter.hashHistory.pushState(undefined, `/lobby/${lobby.lobbyId}`);
        });
    }
}
//# sourceMappingURL=GameDescription.js.map