"use strict";

class GameDescription extends React.Component<any, any> {

    constructor() {
        super();
        this.startGame = this.startGame.bind(this);
    }


    //TODO: generate gameconfig id based on selected settings, change player number to ocmbo box

    public render(): JSX.Element {
        return (
            <div style={{ padding: "5px"}}>
                <h3 style={{backgroundColor: "#eee", padding:"0"}} className="text-center">{this.props.game.name}</h3>
                <div>
                    <div className="pull-left">
                        <img width="128"
                             src={"app/games/" + this.props.game.id + "/assets/images/logo.png"}/>
                    </div>
                    <div className="pull-right">
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
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <p>{this.props.game.description}</p>
                        <span>Currently playing: ? games</span>
                    </div>

                </div>
            </div>
        );
    }

    // todo: DEBUG ONLY
    protected componentDidMount(): void {
        if (environment == EnvironmentType.Development) {
            if (this.props.game.id == "tetrominoes") {
                //this.startGame(this.props.game.variants.find((v: any) => v.development == true));
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
