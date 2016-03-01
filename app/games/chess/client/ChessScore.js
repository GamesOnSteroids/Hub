var Chess;
(function (Chess) {
    var Client;
    (function (Client) {
        "use strict";
        class ChessScore extends React.Component {
            render() {
                return (React.createElement("div", null, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("table", {className: "table", style: { textAlign: "left" }}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Nickname"), React.createElement("th", null, "Score"), React.createElement("th", null, "Pieces"))), React.createElement("tbody", null, this.props.players.sort((a, b) => b.gameData.score - a.gameData.score).map((p, index) => {
                    return (React.createElement("tr", {key: p.id}, React.createElement("th", {scope: "row"}, React.createElement("img", {width: "32", height: "32", src: "/app/games/chess/assets/images/teams/" + p.team + ".png"})), React.createElement("td", null, p.name), React.createElement("td", null, p.gameData.score), React.createElement("td", null, p.gameData.pieces)));
                })))))));
            }
        }
        Client.ChessScore = ChessScore;
    })(Client = Chess.Client || (Chess.Client = {}));
})(Chess || (Chess = {}));
