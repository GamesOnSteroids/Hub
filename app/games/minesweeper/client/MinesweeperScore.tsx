namespace Minesweeper.Client {
    "use strict";

    export class MinesweeperScore extends React.Component<{players: PlayerInfo[], remainingMines: number}, any> {
        public render(): JSX.Element {
            var totalFlags: number = 0;
            for (let player of this.props.players) {
                totalFlags += player.gameData.flags;
            }

            return (
                <div>
                    <div className="row">
                        <div className="col-xs-6">
                            <img src="/app/games/minesweeper/assets/images/flag-0.png"/>: {totalFlags}
                        </div>
                        <div className="col-xs-6">
                            <img src="/app/games/minesweeper/assets/images/mine-0.png"/>: {this.props.remainingMines}
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
                                        <th>Flags</th>
                                        <th>Mines</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.players.sort((a, b) => b.gameData.score - a.gameData.score).map( (p, index) => {
                                        return (
                                        <tr key={p.id}>
                                            <th scope="row">
                                                <img src={"/app/games/minesweeper/assets/images/flag-" + p.team + ".png"}/>
                                            </th>
                                            <td>{p.name}</td>
                                            <td>{p.gameData.score}</td>
                                            <td>{p.gameData.flags}</td>
                                            <td>{p.gameData.mines}</td>
                                        </tr>)
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>);
        }
    }

}