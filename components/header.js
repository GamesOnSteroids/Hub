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
        return (React.createElement("nav", {"className": "navbar navbar-inverse navbar-fixed-top"}, React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "navbar-header"}, React.createElement(ReactRouter.Link, {"className": "navbar-brand", "to": `/`}, "Games on Steroids")), React.createElement("div", {"id": "navbar", "className": "navbar-collapse collapse"}, React.createElement("form", {"className": "navbar-form navbar-right"}, React.createElement("div", {"className": "form-group"}, React.createElement("input", {"type": "text", "placeholder": "Nickname", "className": "form-control", "onChange": this.onNicknameChange, "value": localStorage.getItem("nickname")})))))));
    }
}
//# sourceMappingURL=header.js.map