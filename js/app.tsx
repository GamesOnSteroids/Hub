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

}


class Header extends React.Component<any, any> {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <ReactRouter.Link className="navbar-brand" to={`/`}>Games on Steroids</ReactRouter.Link>
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li className="active">
                                <ReactRouter.Link to={`/lobby`}>Test</ReactRouter.Link>
                            </li>
                            <li>
                                <a href="#about">About</a>
                            </li>
                            <li>
                                <a href="#contact">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}


class LobbyComponent extends React.Component<any, any> {
    componentDidMount():void {
        let gameConfiguration = {
            gameId: "minesweeper",
            maxPlayers: 2,
            width: 10,
            height: 10,
            mines: 1
        };
        let lobbyService: ILobbyService = new FirebaseLobbyService();
        lobbyService.findLobby(gameConfiguration);
    }

    render() {
        var progressBarStyle = {width: "100%"};
        return (
            <div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="progress">
                                    <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={progressBarStyle}>
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
                        <div>
                            <textarea className="form-control" rows="3"></textarea>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Text input"></input>
                                <span className="input-group-btn">
                                    <button className="btn  btn-primary btn-block glyphicon glyphicon-envelope"></button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}


class GameDescription extends React.Component<any, any> {

    startGame() {
        ReactRouter.browserHistory.pushState({game: "minesweeper"}, '/lobby');
    }

    render() {
        return (
            <div>
                <h3>Minesweeper on Steroids</h3>
                <div>
                    <img src=".png"/>
                    <p>Mines go boom boom!</p>
                    <span>Currently playing: ? games</span>
                </div>
                <div className="btn-group-vertical" role="group">
                    <button type="button" className="btn btn-primary" onClick={this.startGame}>
                        <span className="glyphicon glyphicon-align-left"/>
                        Play 1v1 now!
                    </button>
                    <button type="button" className="btn btn-default">
                        <span className="glyphicon glyphicon-align-left"/>
                        Play with friend
                    </button>
                </div>
            </div>
        );
    }
}
class GameList extends React.Component<any, any> {
    render() {
        return (
            <div>
                <GameDescription game="minesweeper"/>
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


                <footer className="footer">
                    <p>&copy; 2016 Games on Steroids</p>
                </footer>

            </div>
        );
    }
}

var createHistory = ((window as any).History as HistoryModule.Module).createHistory;

//ReactRouter.browserHistory = createHistory();

ReactDOM.render((
    <ReactRouter.Router history={ReactRouter.browserHistory}>
        <ReactRouter.Route path="/" component={App}>
            <ReactRouter.IndexRoute component={LobbyComponent}/>
            <ReactRouter.Route path="/games" component={GameList}/>
            <ReactRouter.Route path="/minesweeper" component={MinesweeperApp}/>
            <ReactRouter.Route path="/lobby" component={LobbyComponent}/>
        </ReactRouter.Route>
    </ReactRouter.Router>
), document.getElementById('content'));
