"use strict";



window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

//navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;



var games = [
    {
        id: "minesweeper",
        appClass: "Minesweeper.Client.MinesweeperApp",
        gameClass: "Minesweeper.Client.MinesweeperGame",
        serviceClass: "Minesweeper.Server.MinesweeperService",
        name: "Minesweeper on Steroids",
        configurations: [
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
            //{
            //    id: "friend",
            //    name: "Play with friend",
            //    maxPlayers: 2,
            //    width: 10,
            //    height: 10,
            //    mines: 1
            //},
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
        configurations: [
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1
            }
        ]
    }
];

class App extends React.Component<any, any> {
    render() {
        return (
            <div className="container-fluid">

                <Header />

                {this.props.children}


            </div>
        );
    }
}

//var createHistory = ((window as any).History as HistoryModule.Module).createHistory;
//ReactRouter.browserHistory = createHistory();

ReactDOM.render((
    <ReactRouter.Router history={ReactRouter.hashHistory}>
        <ReactRouter.Route path="/" component={App}>
            <ReactRouter.IndexRoute component={GameList}/>
            <ReactRouter.Route path="/games" component={GameList}/>
            <ReactRouter.Route path="/lobby/:lobbyId" component={LobbyComponent}/>
            <ReactRouter.Route path="*" component={NoMatch}/>
        </ReactRouter.Route>
    </ReactRouter.Router>
), document.getElementById('content'));
