"use strict";
class MinesweeperScore extends React.Component<any, any> {

}

class MinesweeperGameOver extends React.Component<any, any> {
    render() {
        return (
            <div>
                <p>GAME OVER</p>
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
        return (
            <div>
                <p>"MinesweeperApp"</p>
            <canvas id="game-canvas"/>
            { this.state.isGameOver ? <MinesweeperGameOver /> : null }
        </div>
    );
    }
}