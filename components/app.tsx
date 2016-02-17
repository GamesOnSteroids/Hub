"use strict";



window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

//navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;



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

class App extends React.Component<any, any> {
    render() {
        return (
            <div className="container">

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
