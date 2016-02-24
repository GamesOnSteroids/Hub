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
"use strict";
class Header extends React.Component {
    constructor() {
        super();
        this.onNicknameChange = this.onNicknameChange.bind(this);
        var nickname = localStorage.getItem("nickname");
        if (nickname == null || nickname == "") {
            localStorage.setItem("nickname", this.generateName());
        }
        this.state = { nickname: nickname };
    }
    generateName() {
        return "Guest #" + Math.round(Math.random() * 100);
    }
    onNicknameChange(e) {
        var nickname = e.target.value;
        if (nickname == null || nickname == "") {
            nickname = this.generateName();
        }
        localStorage.setItem("nickname", nickname);
        this.setState({
            nickname: localStorage.getItem("nickname")
        });
    }
    render() {
        return (React.createElement("nav", {"className": "navbar navbar-inverse navbar-fixed-top"}, React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "navbar-header"}, React.createElement(ReactRouter.Link, {"className": "navbar-brand", "to": `/`}, "Games on Steroids")), React.createElement("div", {"id": "navbar", "className": "navbar-collapse collapse"}, React.createElement("form", {"className": "navbar-form navbar-right"}, React.createElement("div", {"className": "form-group"}, React.createElement("input", {"type": "text", "placeholder": "Nickname", "className": "form-control", "onChange": this.onNicknameChange, "value": localStorage.getItem("nickname"), "autoComplete": "nickname"})))))));
    }
}
//# sourceMappingURL=Header.js.map