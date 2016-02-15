var Lobby = Play.Lobby;
var LobbyService = Play.FirebaseLobbyService;
var FirebaseLobbyService = Play.FirebaseLobbyService;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
class Chat extends React.Component {
}
class Header extends React.Component {
    render() {
        return (React.createElement("nav", {"className": "navbar navbar-inverse navbar-fixed-top"}, React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "navbar-header"}, React.createElement("button", {"type": "button", "className": "navbar-toggle collapsed", "data-toggle": "collapse", "data-target": "#navbar", "aria-expanded": "false", "aria-controls": "navbar"}, React.createElement("span", {"className": "sr-only"}, "Toggle navigation"), React.createElement("span", {"className": "icon-bar"}), React.createElement("span", {"className": "icon-bar"}), React.createElement("span", {"className": "icon-bar"})), React.createElement(ReactRouter.Link, {"className": "navbar-brand", "to": `/`}, "Games on Steroids")), React.createElement("div", {"id": "navbar", "className": "collapse navbar-collapse"}, React.createElement("ul", {"className": "nav navbar-nav"}, React.createElement("li", {"className": "active"}, React.createElement(ReactRouter.Link, {"to": `/lobby`}, "Test")), React.createElement("li", null, React.createElement("a", {"href": "#about"}, "About")), React.createElement("li", null, React.createElement("a", {"href": "#contact"}, "Contact")))))));
    }
}
class LobbyComponent extends React.Component {
    componentDidMount() {
        let gameConfiguration = {
            gameId: "minesweeper",
            maxPlayers: 2,
            width: 10,
            height: 10,
            mines: 10
        };
        let lobbyService = new FirebaseLobbyService();
        lobbyService.findLobby(gameConfiguration);
    }
    render() {
        return (React.createElement("div", null, "lobby ", this.props.game));
    }
}
class GameDescription extends React.Component {
    startGame() {
        ReactRouter.browserHistory.pushState({ game: "minesweeper" }, '/lobby');
    }
    render() {
        return (React.createElement("div", null, React.createElement("h3", null, "Minesweeper on Steroids"), React.createElement("div", null, React.createElement("img", {"src": ".png"}), React.createElement("p", null, "Mines go boom boom!"), React.createElement("span", null, "Currently playing: 30 players")), React.createElement("div", {"className": "btn-group-vertical", "role": "group"}, React.createElement("button", {"type": "button", "className": "btn btn-primary", "onClick": this.startGame}, React.createElement("span", {"className": "glyphicon glyphicon-align-left"}), "Play 1v1 now!"), React.createElement("button", {"type": "button", "className": "btn btn-default"}, React.createElement("span", {"className": "glyphicon glyphicon-align-left"}), "Play with friend"))));
    }
}
class GameList extends React.Component {
    render() {
        return (React.createElement("div", null, React.createElement(GameDescription, {"game": "minesweeper"})));
    }
}
class App extends React.Component {
    render() {
        return (React.createElement("div", {"className": "container"}, React.createElement(Header, null), this.props.children, React.createElement("footer", {"className": "footer"}, React.createElement("p", null, "© 2016 Games on Steroids"))));
    }
}
var createHistory = window.History.createHistory;
ReactDOM.render((React.createElement(ReactRouter.Router, {"history": ReactRouter.browserHistory}, React.createElement(ReactRouter.Route, {"path": "/", "component": App}, React.createElement(ReactRouter.IndexRoute, {"component": LobbyComponent}), React.createElement(ReactRouter.Route, {"path": "/games", "component": GameList}), React.createElement(ReactRouter.Route, {"path": "/minesweeper", "component": MinesweeperApp}), React.createElement(ReactRouter.Route, {"path": "/lobby", "component": LobbyComponent})))), document.getElementById('content'));
//# sourceMappingURL=app.js.map