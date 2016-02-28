var Tetrominoes;
(function (Tetrominoes) {
    var Client;
    (function (Client) {
        "use strict";
        class TetrominoesScore extends React.Component {
            render() {
                return (React.createElement("div", null, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("table", {className: "table", style: { textAlign: "left" }}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Nickname"), React.createElement("th", null, "Score"), React.createElement("th", null, "Lines"))), React.createElement("tbody", null, this.props.players.sort((a, b) => b.gameData.score - a.gameData.score).map((p, index) => {
                    return (React.createElement("tr", {key: p.id}, React.createElement("th", {scope: "row"}, React.createElement("img", {src: "/app/games/tetrominoes/assets/images/" + p.team + ".png"})), React.createElement("td", null, p.name), React.createElement("td", null, p.gameData.score), React.createElement("td", null, p.gameData.lines)));
                })))))));
            }
        }
        Client.TetrominoesScore = TetrominoesScore;
    })(Client = Tetrominoes.Client || (Tetrominoes.Client = {}));
})(Tetrominoes || (Tetrominoes = {}));
