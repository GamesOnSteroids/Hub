import ReactElement = __React.ReactElement;
"use strict";
class GameList extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        let gameList:JSX.Element[] = [];
        for (let game of games) {
            gameList.push(<GameDescription key={game.id} game={game}/>);
        }
        return (
            <div>
                {gameList}
            </div>
        );
    }
}
