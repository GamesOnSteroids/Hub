"use strict";
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
class GameList extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (React.createElement("div", {"className": "row"}, gamesConfiguration
            .filter(g => g.development != true || environment == EnvironmentType.Development)
            .map((game, index) => {
            let result = [];
            index++;
            result.push(React.createElement("div", {"className": "col-lg-3 col-md-4 col-sm-6 col-xs-12"}, React.createElement(GameDescription, {"game": game})));
            if (index % 4 == 0) {
                result.push(React.createElement("div", {"className": "visible-lg clearfix divider"}));
            }
            if (index % 3 == 0) {
                result.push(React.createElement("div", {"className": "visible-md clearfix divider"}));
            }
            if (index % 2 == 0) {
                result.push(React.createElement("div", {"className": "visible-sm clearfix divider"}));
            }
            result.push(React.createElement("div", {"className": "visible-xs clearfix divider"}));
            return result;
        })));
    }
}
//# sourceMappingURL=GameList.js.map