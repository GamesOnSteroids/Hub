var Minesweeper;
(function (Minesweeper) {
    var Client;
    (function (Client) {
        "use strict";
        class MinesweeperScore extends React.Component {
            render() {
                var totalFlags = 0;
                for (let player of this.props.players) {
                    totalFlags += player.gameData.flags;
                }
                return (React.createElement("div", null, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-6"}, React.createElement("img", {src: "/app/games/minesweeper/assets/images/flag-0.png"}), ": ", totalFlags), React.createElement("div", {className: "col-xs-6"}, React.createElement("img", {src: "/app/games/minesweeper/assets/images/mine-0.png"}), ": ", this.props.remainingMines)), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-12"}, React.createElement("table", {className: "table", style: { textAlign: "left" }}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Nickname"), React.createElement("th", null, "Score"), React.createElement("th", null, "Flags"), React.createElement("th", null, "Mines"))), React.createElement("tbody", null, this.props.players.sort((a, b) => b.gameData.score - a.gameData.score).map((p, index) => {
                    return (React.createElement("tr", {key: p.id}, React.createElement("th", {scope: "row"}, React.createElement("img", {src: "/app/games/minesweeper/assets/images/flag-" + p.team + ".png"})), React.createElement("td", null, p.name), React.createElement("td", null, p.gameData.score), React.createElement("td", null, p.gameData.flags), React.createElement("td", null, p.gameData.mines)));
                })))))));
            }
        }
        Client.MinesweeperScore = MinesweeperScore;
    })(Client = Minesweeper.Client || (Minesweeper.Client = {}));
})(Minesweeper || (Minesweeper = {}));
