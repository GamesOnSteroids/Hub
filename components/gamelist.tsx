
class GameList extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        let gameList:any[] = [];
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
