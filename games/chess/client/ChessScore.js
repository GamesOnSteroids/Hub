var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var Chess;
(function (Chess) {
    var Client;
    (function (Client) {
        "use strict";
        class ChessScore extends React.Component {
            render() {
                return (React.createElement("div", null, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-xs-12"}, React.createElement("table", {"className": "table", "style": { textAlign: "left" }}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Nickname"), React.createElement("th", null, "Score"), React.createElement("th", null, "Pieces"))), React.createElement("tbody", null, this.props.players.sort((a, b) => b.gameData.score - a.gameData.score).map((p, index) => {
                    return (React.createElement("tr", {"key": p.id}, React.createElement("th", {"scope": "row"}, React.createElement("img", {"width": "32", "height": "32", "src": "/games/chess/assets/images/1-" + p.team + ".png"})), React.createElement("td", null, p.name), React.createElement("td", null, p.gameData.score), React.createElement("td", null, p.gameData.pieces)));
                })))))));
            }
        }
        Client.ChessScore = ChessScore;
    })(Client = Chess.Client || (Chess.Client = {}));
})(Chess || (Chess = {}));
//# sourceMappingURL=ChessScore.js.map