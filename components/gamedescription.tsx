
class GameDescription extends React.Component<any, any> {

    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }

    startGame(configuration:any) {
        configuration.gameId = this.props.game.id;

        let lobbyService:Play.ILobbyService = new Play.FirebaseLobbyService();
        lobbyService.findLobby(configuration).then((lobby) => {
            Play.ClientLobby.current = lobby;

            ReactRouter.hashHistory.pushState(null, `/lobby/${lobby.lobbyId}`);
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