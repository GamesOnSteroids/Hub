"use strict";
class GameList extends React.Component {
    constructor() {
        super();
    }
    render() {
        let gameList = [];
        for (let game of games) {
            gameList.push(React.createElement(GameDescription, {"key": game.id, "game": game}));
        }
        return (React.createElement("div", null, gameList));
    }
}
//# sourceMappingURL=GameList.js.map