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
                maxPlayers: 2
            }
        ]
    },
    {
        id: "anagrams",
        name: "Anagrams on Steroids",
        appClass: "Anagrams.Client.AnagramsApp",
        gameClass: "Anagrams.Client.AnagramsGame",
        serviceClass: "Anagrams.Server.AnagramsService",
        variants: [
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1
            }
        ]
    }, {
        id: "typing",
        name: "Typing on Steroids",
        variants: [
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1
            }
        ]
    }
];
class App extends React.Component {
    render() {
        return (React.createElement("div", null, React.createElement(Header, null), ",", React.createElement("div", {"className": "container"}, this.props.children)));
    }
}
document.onkeydown = function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        let d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' &&
            (d.type.toUpperCase() === 'TEXT' ||
                d.type.toUpperCase() === 'PASSWORD' ||
                d.type.toUpperCase() === 'FILE' ||
                d.type.toUpperCase() === 'SEARCH' ||
                d.type.toUpperCase() === 'EMAIL' ||
                d.type.toUpperCase() === 'NUMBER' ||
                d.type.toUpperCase() === 'DATE')) ||
            d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }
    if (doPrevent) {
        event.preventDefault();
    }
};
ReactDOM.render((React.createElement(ReactRouter.Router, {"history": ReactRouter.hashHistory}, React.createElement(ReactRouter.Route, {"path": "/", "component": App}, React.createElement(ReactRouter.IndexRoute, {"component": GameList}), React.createElement(ReactRouter.Route, {"path": "/games", "component": GameList}), React.createElement(ReactRouter.Route, {"path": "/lobby/:lobbyId", "component": LobbyComponent}), React.createElement(ReactRouter.Route, {"path": "*", "component": NoMatch})))), document.getElementById('content'));
//# sourceMappingURL=App.js.map