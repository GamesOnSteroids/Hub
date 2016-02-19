"use strict";

class GameDescription extends React.Component<any, any> {

    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }

    static resolveClass(name: string) {
        let result: any = window;
        for (let part of name.split(".")) {
            result = result[part];
        }
        if (result == null) {
            throw `Class: ${name} not found`;
        }
        return result;
    }


    //TODO: DEBUG ONLY
    componentDidMount() {
        //if (this.props.game.id == "chess") {
//            this.startGame(this.props.game.configurations[0]);
//        }
    }

    startGame(configuration:any) {
        console.log("GameDescription.startGame", configuration);

        configuration.gameId = this.props.game.id;
        configuration.appClass = GameDescription.resolveClass(this.props.game.appClass);
        configuration.gameClass = GameDescription.resolveClass(this.props.game.gameClass);
        configuration.serviceClass = GameDescription.resolveClass(this.props.game.serviceClass);


        let lobbyService:Play.ILobbyService = new Play.FirebaseLobbyService();
        lobbyService.findLobby(configuration).then((lobby) => {
            Play.Client.ClientLobby.current = lobby;

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
                        {configuration.name}
                    </button>)) }
                </div>
            </div>
        );
    }
}
