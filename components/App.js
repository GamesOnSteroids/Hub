"use strict";
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var games = [
    {
        id: "minesweeper",
        image: "https://upload.wikimedia.org/wikipedia/en/5/5c/Minesweeper_Icon.png",
        appClass: "Minesweeper.Client.MinesweeperApp",
        gameClass: "Minesweeper.Client.MinesweeperGame",
        serviceClass: "Minesweeper.Server.MinesweeperService",
        name: "Minesweeper on Steroids",
        variants: [
            {
                id: "default",
                name: "2 Players",
                maxPlayers: 2,
                width: 16,
                height: 16,
                mines: 40
            },
            {
                id: "3players",
                name: "3 Players",
                maxPlayers: 3,
                width: 16,
                height: 16,
                mines: 40
            },
            {
                id: "4players",
                name: "4 Players",
                maxPlayers: 4,
                width: 30,
                height: 16,
                mines: 99
            },
            {
                id: "solo",
                name: "1 Player",
                maxPlayers: 1,
                width: 30,
                height: 16,
                mines: 99
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
        appClass: "Chess.Client.ChessApp",
        gameClass: "Chess.Client.ChessGame",
        serviceClass: "Chess.Server.ChessService",
        name: "Chess on Steroids",
        variants: [
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1
            }
        ]
    },
    {
        id: "anagrams",
        name: "Anagrams on Steroids",
        variants: [
            {
                id: "debug",
                name: "debug"
            }
        ]
    }, {
        id: "typing",
        name: "Typing on Steroids",
        variants: [
            {
                id: "debug",
                name: "debug"
            }
        ]
    }
];
class App extends React.Component {
    render() {
        return (React.createElement("div", {"className": "container-fluid"}, React.createElement(Header, null), this.props.children));
    }
}
ReactDOM.render((React.createElement(ReactRouter.Router, {"history": ReactRouter.hashHistory}, React.createElement(ReactRouter.Route, {"path": "/", "component": App}, React.createElement(ReactRouter.IndexRoute, {"component": GameList}), React.createElement(ReactRouter.Route, {"path": "/games", "component": GameList}), React.createElement(ReactRouter.Route, {"path": "/lobby/:lobbyId", "component": LobbyComponent}), React.createElement(ReactRouter.Route, {"path": "*", "component": NoMatch})))), document.getElementById('content'));
//# sourceMappingURL=App.js.map