"use strict";
class GameList extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (React.createElement("div", {className: "row"}, gamesConfiguration
            .filter(g => g.development != true || environment == EnvironmentType.Development)
            .map((game, index) => {
            let result = [];
            index++;
            result.push(React.createElement("div", {className: "col-lg-3 col-md-4 col-sm-6 col-xs-12"}, React.createElement(GameDescription, {game: game})));
            if (index % 4 == 0) {
                result.push(React.createElement("div", {className: "visible-lg clearfix divider"}));
            }
            if (index % 3 == 0) {
                result.push(React.createElement("div", {className: "visible-md clearfix divider"}));
            }
            if (index % 2 == 0) {
                result.push(React.createElement("div", {className: "visible-sm clearfix divider"}));
            }
            result.push(React.createElement("div", {className: "visible-xs clearfix divider"}));
            return result;
        })));
    }
}
