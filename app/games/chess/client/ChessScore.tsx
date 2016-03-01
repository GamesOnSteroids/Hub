namespace Chess.Client {
    "use strict";

    export class ChessScore extends React.Component<{players: PlayerInfo[]}, any> {
        public render(): JSX.Element {
            return (
                <div>
                    <div className="row">
                        <div className="col-xs-12">
                            <table className="table" style={{textAlign: "left"}}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nickname</th>
                                        <th>Score</th>
                                        <th>Pieces</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.players.sort((a, b) => b.gameData.score - a.gameData.score).map( (p, index) => {
                                        return (
                                        <tr key={p.id}>
                                            <th scope="row"><img width="32" height="32" src={"/app/games/chess/assets/images/teams/" + p.team + ".png"} /></th>
                                            <td>{p.name}</td>
                                            <td>{p.gameData.score}</td>
                                            <td>{p.gameData.pieces}</td>
                                        </tr>);
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>);
        }
    }

}