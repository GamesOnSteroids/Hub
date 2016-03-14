"use strict";
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
class DebugConsole extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: []
        };
    }
    componentDidMount() {
        let oldCallback = console.log;
        console.log = (...params) => {
            if (console["messages"] == null) {
                console["messages"] = [];
            }
            console["messages"].unshift(JSON.stringify(params));
            oldCallback.apply(console, params);
            this.setState({
                messages: console["messages"]
            });
        };
    }
    render() {
        return (React.createElement("div", {className: "console"}, this.state.messages.map((m, i) => React.createElement("div", {key: i, className: "console-message"}, m))));
    }
}
class App extends React.Component {
    render() {
        return (React.createElement("div", null, React.createElement(Header, null), environment == EnvironmentType.Development && (typeof window.orientation !== "undefined") ? React.createElement(DebugConsole, null) : "", React.createElement("div", {className: "container-fluid"}, this.props.children)));
    }
}
document.onkeydown = function (event) {
    let doPrevent = false;
    if (event.keyCode === 8) {
        let d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === "INPUT" &&
            (d.type.toUpperCase() === "TEXT" ||
                d.type.toUpperCase() === "PASSWORD" ||
                d.type.toUpperCase() === "FILE" ||
                d.type.toUpperCase() === "SEARCH" ||
                d.type.toUpperCase() === "EMAIL" ||
                d.type.toUpperCase() === "NUMBER" ||
                d.type.toUpperCase() === "DATE")) ||
            d.tagName.toUpperCase() === "TEXTAREA") {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }
    if (doPrevent) {
        event.preventDefault();
    }
};
ReactDOM.render((React.createElement(ReactRouter.Router, {history: ReactRouter.hashHistory}, React.createElement(ReactRouter.Route, {path: "/", component: App}, React.createElement(ReactRouter.IndexRoute, {component: GameList}), React.createElement(ReactRouter.Route, {path: "/games", component: GameList}), React.createElement(ReactRouter.Route, {path: "/lobby/:lobbyId", component: LobbyComponent, onLeave: LobbyComponent.onLeave, onEnter: LobbyComponent.onEnter}), React.createElement(ReactRouter.Route, {path: "*", component: NoMatch})))), document.getElementById("content"));
