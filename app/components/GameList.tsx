"use strict";

import FirebaseLobbyService = Play.FirebaseLobbyService;
import ILobbyDescription = Play.ILobbyDescription;

class GameList extends React.Component<any, {lobbies: ILobbyDescription[]}> {

    constructor() {
        super();

        this.state = {
            lobbies: []
        };
    }

    protected componentDidMount(): void {
        let lobbyService = new FirebaseLobbyService();
        lobbyService.getLobbyList().then( (lobbies) => {
            this.setState({
                lobbies: lobbies
            });
        });
    }

    public render(): JSX.Element {

        let gameCounts = new Map<string, number>();
        for (let lobby of this.state.lobbies) {
            let count = gameCounts.get(lobby.gameId);
            if (count == null) {
                count = 1;
            } else {
                count++;
            }
            gameCounts.set(lobby.gameId, count);
        }

        return (
            <div className="row">
                {gamesConfiguration
                    .filter(g => g.development != true || environment == EnvironmentType.Development)
                    .map( (gameConfiguration, index) => {
                    let result: JSX.Element[] = [];
                    index++;

                    result.push(
                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                        <GameDescription gameConfiguration={gameConfiguration} gameCount={gameCounts.get(gameConfiguration.id)}/>
                    </div>);
                    if (index % 4 == 0) {
                        result.push(<div className="visible-lg clearfix divider"></div>);
                    }
                    if (index % 3 == 0) {
                        result.push(<div className="visible-md clearfix divider"></div>);
                    }
                    if (index % 2 == 0) {
                        result.push(<div className="visible-sm clearfix divider"></div>);
                    }
                    result.push(<div className="visible-xs clearfix divider"></div>);

                    return result;})}
            </div>
        );
    }
}
