"use strict";
var Lobby = Play.Lobby;
var LobbyService = Play.FirebaseLobbyService;
var FirebaseLobbyService = Play.FirebaseLobbyService;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
class Chat extends React.Component {
    render() {
        return (React.createElement("div", null, React.createElement("textarea", {"className": "form-control"}), React.createElement("div", {"className": "input-group"}, React.createElement("input", {"type": "text", "className": "form-control", "placeholder": "Type your message..."}), React.createElement("span", {"className": "input-group-btn"}, React.createElement("button", {"className": "btn  btn-primary btn-block glyphicon glyphicon-envelope"})))));
    }
}
class Header extends React.Component {
    render() {
        return (React.createElement("nav", {"className": "navbar navbar-inverse navbar-fixed-top"}, React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "navbar-header"}, React.createElement(ReactRouter.Link, {"className": "navbar-brand", "to": `/`}, "Games on Steroids")))));
    }
}
class LobbyComponent extends React.Component {
    render() {
        return (React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-8"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-12"}, React.createElement("div", {"className": "progress"}, React.createElement("div", {"className": "progress-bar progress-bar-striped active", "role": "progressbar", "style": { width: "100%" }}, React.createElement("span", null, "Searching for players"))))), React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-md-12"}, React.createElement("div", null, "Player 1"), React.createElement("div", null, "Player 2"))))), React.createElement("div", {"className": "col-md-4"}, React.createElement(Chat, null)))));
    }
}
class GameDescription extends React.Component {
    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }
    startGame(configuration) {
        configuration.gameId = this.props.game.id;
        let lobbyService = new FirebaseLobbyService();
        lobbyService.findLobby(configuration).then((lobby) => {
            ReactRouter.hashHistory.pushState(null, `/lobby/${lobby.configuration.lobbyId}`);
        });
    }
    render() {
        return (React.createElement("div", null, React.createElement("h3", null, this.props.game.name), React.createElement("div", null, React.createElement("p", null, this.props.game.description), React.createElement("span", null, "Currently playing: ? games")), React.createElement("div", {"className": "btn-group-vertical", "role": "group"}, this.props.game.configurations.map((configuration) => (React.createElement("button", {"key": configuration.id, "type": "button", "className": configuration.id == "default" ? "btn btn-primary" : "btn btn-default", "onClick": this.startGame.bind(this, configuration)}, React.createElement("span", {"className": "glyphicon glyphicon-align-left"}), configuration.name))))));
    }
}
var games = [
    {
        id: "minesweeper",
        name: "Minesweeper on Steroids",
        configurations: [
            {
                id: "default",
                name: "Play 1v1 now!",
                maxPlayers: 2,
                width: 10,
                height: 10,
                mines: 1
            },
            {
                id: "friend",
                name: "Play with friend",
                maxPlayers: 2,
                width: 10,
                height: 10,
                mines: 1
            }
        ]
    },
    {
        id: "chess",
        name: "Chess on Steroids",
        configurations: []
    }
];
class GameList extends React.Component {
    constructor() {
        super();
    }
    render() {
        let gameList = [];
        for (let game of games) {
            gameList.push(React.createElement(GameDescription, {"key": game.id, "game": game}));
        }
        return (React.createElement("div", null, gameList));
    }
}
class NoMatch extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (React.createElement("div", null, "404"));
    }
}
class App extends React.Component {
    render() {
        return (React.createElement("div", {"className": "container"}, React.createElement(Header, null), this.props.children));
    }
}
ReactDOM.render((React.createElement(ReactRouter.Router, {"history": ReactRouter.hashHistory}, React.createElement(ReactRouter.Route, {"path": "/", "component": App}, React.createElement(ReactRouter.IndexRoute, {"component": GameList}), React.createElement(ReactRouter.Route, {"path": "/games", "component": GameList}), React.createElement(ReactRouter.Route, {"path": "/minesweeper", "component": MinesweeperApp}), React.createElement(ReactRouter.Route, {"path": "/lobby/:lobbyId", "component": LobbyComponent}), React.createElement(ReactRouter.Route, {"path": "*", "component": NoMatch})))), document.getElementById('content'));
//# sourceMappingURL=app.js.map