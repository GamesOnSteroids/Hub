
class Chat extends React.Component {

}

class MinesweeperScore extends React.Component {

}

class MinesweeperApp extends React.Component {

  componentDidMount() {
    let lobby = new Lobby(new Minesweeper.Service.MinesweeperService());
    this.game = new Minesweeper.Game.MinesweeperGame(lobby);
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
      <div className="header clearfix">
        <nav>
          <ul className="nav nav-pills pull-right">
          <li role="presentation" className="active"><a href="#">Games</a></li>
          <li role="presentation"><a href="#">Login</a></li>
          </ul>
        </nav>
        <h3 className="text-muted">Games on Steroids</h3>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Header />

        <MinesweeperApp />

        <footer className="footer">
       <p>&copy; 2016 Games on Steroids</p>
     </footer>

      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(App, null), document.getElementById('content')
);
