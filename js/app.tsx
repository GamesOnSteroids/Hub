"use strict";
import Lobby = Play.Lobby;
import LobbyService = Play.FirebaseLobbyService;
import ILobbyService = Play.ILobbyService;
import FirebaseLobbyService = Play.FirebaseLobbyService;

window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

//navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;


class Chat extends React.Component<any, any> {
    render() {
        return (
            <div>
                <textarea className="form-control"></textarea>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Type your message..."/>
                    <span className="input-group-btn">
                        <button
                            className="btn  btn-primary btn-block glyphicon glyphicon-envelope"></button>
                    </span>
                </div>
            </div>);
    }
}


class Header extends React.Component<any, any> {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <ReactRouter.Link className="navbar-brand" to={`/`}>Games on Steroids</ReactRouter.Link>
                    </div>
                </div>
            </nav>
        );
    }
}


class LobbyComponent extends React.Component<any, any> {


    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped active" role="progressbar"
                                         style={{width: "100%"}}>
                                        <span>Searching for players</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div>Player 1</div>
                                    <div>Player 2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <Chat />
                    </div>
                </div>

            </div>
        )
    }
}


class GameDescription extends React.Component<any, any> {

    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }

    startGame(configuration:any) {
        configuration.gameId = this.props.game.id;

        let lobbyService:ILobbyService = new FirebaseLobbyService();
        lobbyService.findLobby(configuration).then((lobby) => {
            ReactRouter.hashHistory.pushState(null, `/lobby/${lobby.configuration.lobbyId}`);
        });
    }

    render() {
        return (
            <div>
                <h3>{this.props.game.name}</h3>
                <div>
                    <p>{this.props.game.description}</p>
                    <span>Currently playing: ? games</span>
                </div>
                <div className="btn-group-vertical" role="group">
                    { this.props.game.configurations.map( (configuration: any) => (
                    <button key={configuration.id} type="button"
                            className={configuration.id == "default" ? "btn btn-primary" : "btn btn-default"}
                            onClick={this.startGame.bind(this, configuration)}>
                        <span className="glyphicon glyphicon-align-left"/>
                        {configuration.name}
                    </button>)) }
                </div>
            </div>
        );
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

class GameList extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        let gameList:any[] = [];
        for (let game of games) {
            gameList.push(<GameDescription key={game.id} game={game}/>);
        }
        return (
            <div>
                {gameList}
            </div>
        );
    }
}

class NoMatch extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                404
            </div>
        );
    }
}
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
            <ReactRouter.Route path="/minesweeper" component={MinesweeperApp}/>
            <ReactRouter.Route path="/lobby/:lobbyId" component={LobbyComponent}/>
            <ReactRouter.Route path="*" component={NoMatch}/>
        </ReactRouter.Route>
    </ReactRouter.Router>
), document.getElementById('content'));
