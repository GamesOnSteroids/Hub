namespace Tetrominoes.Client {
    "use strict";

    export class TetrominoesScore extends React.Component<{players: PlayerInfo[], level: number}, any> {
        public render(): JSX.Element {
            return (
                <div>
                    <div className="row">
                        <div className="col-xs-12">
                            <span>Level: <b>{this.props.level}</b></span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <table className="table" style={{textAlign: "left"}}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Nickname</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.players.sort((a, b) => b.gameData.score - a.gameData.score).map( (p, index) => {
                                        return (
                                        <tr key={p.id}>
                                            <th scope="row">
                                                <img src={"/app/games/tetrominoes/assets/images/" + p.team + ".png"}/>
                                            </th>
                                            <td>{p.name}</td>
                                            <td>{p.gameData.score}</td>
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