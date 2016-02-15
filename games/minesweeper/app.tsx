"use strict";
class MinesweeperScore extends React.Component<any, any> {

}

class MinesweeperGameOver extends React.Component<any, any> {
    render() {
        var overlayStyle = {
                position: "absolute",
                right: 0,
                bottom: 0,
                left: 0,
                top: 0,
                background: "rgba(1,1,1,0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                textAlign: "center"
            }
            ;
        return (
            <div style={overlayStyle}>
                <div>
                <h2>GAME OVER</h2>
                <br/>
                <button className="btn btn-default">Play again</button>
                </div>
            </div>
        )
    }
}
class MinesweeperApp extends React.Component<any, any> {

    constructor(props) {
        super(props);

        this.state = {isGameOver: false};
    }

    componentDidMount() {
        Lobby.current.game = new Minesweeper.Game.MinesweeperGame(Lobby.current, Lobby.current.configuration);

        Lobby.current.game.onGameOverCallback = () => {
            this.setState({isGameOver: true});
        }
    }

    render() {
        var gameStyle = {position: "relative"};
        return (
            <div style={gameStyle}>
                <p>"MinesweeperApp"</p>
                <canvas id="game-canvas"/>
                { this.state.isGameOver ? <MinesweeperGameOver /> : null }
            </div>
        );
    }
}