"use strict";
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var games = [
    {
        id: "minesweeper",
        name: "Minesweeper on Steroids",
        configurations: [
            {
                id: "default",
                name: "Play 1v1 now!",
                maxPlayers: 2,
                width: 16,
                height: 16,
                mines: 40
            },
            {
                id: "3players",
                name: "Play 1v1v1 now!",
                maxPlayers: 3,
                width: 16,
                height: 16,
                mines: 40
            },
            {
                id: "friend",
                name: "Play with friend",
                maxPlayers: 2,
                width: 10,
                height: 10,
                mines: 1
            },
            {
                id: "solo",
                name: "Play Solo!",
                maxPlayers: 1,
                width: 16,
                height: 16,
                mines: 40
            },
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1,
                width: 10,
                height: 10,
                mines: 2
            },
        ]
    },
    {
        id: "chess",
        name: "Chess on Steroids",
        configurations: []
    }
];
class App extends React.Component {
    render() {
        return (React.createElement("div", {"className": "container"}, React.createElement(Header, null), this.props.children));
    }
}
ReactDOM.render((React.createElement(ReactRouter.Router, {"history": ReactRouter.hashHistory}, React.createElement(ReactRouter.Route, {"path": "/", "component": App}, React.createElement(ReactRouter.IndexRoute, {"component": GameList}), React.createElement(ReactRouter.Route, {"path": "/games", "component": GameList}), React.createElement(ReactRouter.Route, {"path": "/lobby/:lobbyId", "component": LobbyComponent}), React.createElement(ReactRouter.Route, {"path": "*", "component": NoMatch})))), document.getElementById('content'));
//# sourceMappingURL=App.js.map