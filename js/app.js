"use strict";


class Chat extends React.Component {

}

class MinesweeperScore extends React.Component {

}

class MinesweeperApp extends React.Component {

  componentDidMount() {
    this.game = new Minesweeper.Game.MinesweeperGame(Lobby.current);
  }

  render() {
    return (
      <div>
        <p>"MinesweeperApp"</p>
        <canvas id="gameCanvas" />
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <ReactRouter.Link  className="navbar-brand"  to={`/`}>Games on Steroids</ReactRouter.Link>
              </div>
              <div id="navbar" className="collapse navbar-collapse">
                <ul className="nav navbar-nav">
                  <li className="active"><ReactRouter.Link to={`/lobby`}>Test</ReactRouter.Link></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
            </div>
          </nav>
    );
  }
}


class LobbyComponent extends React.Component {
  componentDidMount() {
    let gameConfiguration = {

    };
    let lobby = LobbyService.findLobby(gameConfiguration);

  }

  render() {
    return (
      <div>lobby {this.props.game}</div>
    )
  }
}


class GameDescription extends React.Component {

  startGame() {
    ReactRouter.browserHistory.pushState({ game: "minesweeper" }, '/lobby');
  }

  render() {
    return (
      <div>
        <h3>Minesweeper on Steroids</h3>
        <div>
          <img src=".png"/>
          <p>Mines go boom boom!</p>
          <span>Currently playing: 30 players</span>
        </div>
        <div className="btn-group-vertical" role="group">
          <button type="button" className="btn btn-primary" onClick={this.startGame}>
              <span className="glyphicon glyphicon-align-left"></span> Play 1v1 now!
          </button>
          <button type="button" className="btn btn-default">
              <span className="glyphicon glyphicon-align-left"></span> Play with friend
          </button>
        </div>
      </div>
    );
  }
}
class GameList extends React.Component {
  render() {
      return (
        <div>
          <GameDescription game="minesweeper" />
        </div>
      );
  }
}
class App extends React.Component {
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

ReactRouter.browserHistory = History.createHistory();
ReactDOM.render((
    <ReactRouter.Router history={ReactRouter.browserHistory}>
      <ReactRouter.Route path="/" component={App}>
        <ReactRouter.IndexRoute component={LobbyComponent}/>
        <ReactRouter.Route path="/games" component={GameList} />
        <ReactRouter.Route path="/minesweeper" component={MinesweeperApp}/>
        <ReactRouter.Route path="/lobby" component={LobbyComponent}/>
      </ReactRouter.Route>
    </ReactRouter.Router>
), document.getElementById('content'));
