"use strict";

class GameDescription extends React.Component<any, any> {

    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }



    public render(): JSX.Element {
        return (
            <div>
                <h3>{this.props.game.name}</h3>
                <div>
                    <p>{this.props.game.description}</p>
                    <span>Currently playing: ? games</span>
                </div>
                <div className="btn-group-vertical" role="group">
                    { this.props.game.variants
                        .filter((v: any) => v.development != true || environment == EnvironmentType.Development)
                        .map( (variant: any) => (
                    <button key={variant.id} type="button"
                            className={variant.id == "default" ? "btn btn-primary" : "btn btn-default"}
                            onClick={this.startGame.bind(this, variant)}>
                        {variant.name}
                    </button>)) }
                </div>
            </div>
        );
    }

    // todo: DEBUG ONLY
    protected componentDidMount(): void {
        if (environment == EnvironmentType.Development) {
            if (this.props.game.id == "mahjong") {
                this.startGame(this.props.game.variants[0]);
            }
        }
    }

    private startGame(variant: any): void {
        console.log("GameDescription.startGame", variant);

        let lobbyConfiguration = new Play.LobbyConfiguration();
        lobbyConfiguration.maxPlayers = variant.maxPlayers;
        lobbyConfiguration.gameConfiguration = variant;
        lobbyConfiguration.gameId = this.props.game.id;
        lobbyConfiguration.appClass = ClassUtils.resolveClass(this.props.game.appClass);
        lobbyConfiguration.gameClass = ClassUtils.resolveClass(this.props.game.gameClass);
        lobbyConfiguration.serviceClass = ClassUtils.resolveClass(this.props.game.serviceClass);


        let lobbyService: Play.ILobbyService = new Play.FirebaseLobbyService();
        lobbyService.findLobby(lobbyConfiguration).then((lobby) => {
            Play.Client.ClientLobby.current = lobby;

            ReactRouter.hashHistory.pushState(undefined, `/lobby/${lobby.lobbyId}`);
        });
    }

}