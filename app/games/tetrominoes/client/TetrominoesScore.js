var Tetrominoes;
(function (Tetrominoes) {
    var Client;
    (function (Client) {
        "use strict";
        class TetrominoesScore extends React.Component {
            render() {
                return (React.createElement("div", null, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("span", null, "Level: ", React.createElement("b", null, this.props.level)))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("table", {className: "table", style: { textAlign: "left" }}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Nickname"), React.createElement("th", null, "Score"))), React.createElement("tbody", null, this.props.players.sort((a, b) => b.gameData.score - a.gameData.score).map((p, index) => {
                    var teamIcon = `app/games/tetrominoes/assets/images/teams/${ClientLobby.current.getPlayerColor(p)}.png`;
                    return (React.createElement("tr", {key: p.id}, React.createElement("th", {scope: "row"}, React.createElement("img", {src: teamIcon})), React.createElement("td", null, p.name), React.createElement("td", null, p.gameData.score)));
                })))))));
            }
        }
        Client.TetrominoesScore = TetrominoesScore;
    })(Client = Tetrominoes.Client || (Tetrominoes.Client = {}));
})(Tetrominoes || (Tetrominoes = {}));
