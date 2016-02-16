
class LobbyComponent extends React.Component<any, any> {

    constructor() {
        super();
        this.state = {gameRunning: Play.ClientLobby.current.gameStarted};

        Play.ClientLobby.current.gameStartedCallback = () => {
            this.setState({gameRunning: true});
        }
    }

    render() {
        if (!this.state.gameRunning) {
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
        } else {
            var game = React.createElement(MinesweeperApp);
            return (<div>
                {game}
            </div>)
        }
    }
}
