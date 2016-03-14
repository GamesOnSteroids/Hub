"use strict";


window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

// navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;

class DebugConsole extends React.Component<any, any> {

    constructor() {
        super();
        this.state = {
            messages: []
        };
    }

    protected componentDidMount(): void {
        let oldCallback = console.log;
        console.log = (...params: any[]) => {
            if (console["messages"] == null) {
                console["messages"] = [];
            }
            console["messages"].push(JSON.stringify(params));
            oldCallback.apply(console, params);
            this.setState({
                messages: console["messages"]
            });
        };
    }

    public render(): JSX.Element {
        return (<div className="console">
            {this.state.messages.map((m, i) => <div key={i} className="console-message">{m}</div>)}
        </div>);
    }
}

class App extends React.Component<any, any> {
    public render(): JSX.Element {
        console.log(navigator.userAgent);
        return (
            <div>
                <Header />
                {environment == EnvironmentType.Development ? <DebugConsole/>:""}
                <div className="container-fluid">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

// var createHistory = ((window as any).History as HistoryModule.Module).createHistory;
// ReactRouter.browserHistory = createHistory();

document.onkeydown = function (event) {
    let doPrevent = false;
    if (event.keyCode === 8) {
        let d: any = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === "INPUT" &&
                (
                d.type.toUpperCase() === "TEXT" ||
                d.type.toUpperCase() === "PASSWORD" ||
                d.type.toUpperCase() === "FILE" ||
                d.type.toUpperCase() === "SEARCH" ||
                d.type.toUpperCase() === "EMAIL" ||
                d.type.toUpperCase() === "NUMBER" ||
                d.type.toUpperCase() === "DATE" )
            ) ||
            d.tagName.toUpperCase() === "TEXTAREA") {
            doPrevent = d.readOnly || d.disabled;
        } else {
            doPrevent = true;
        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
};



ReactDOM.render(
    (
        <ReactRouter.Router history={ReactRouter.hashHistory}>
            <ReactRouter.Route path="/" component={App}>
                <ReactRouter.IndexRoute component={GameList}/>
                <ReactRouter.Route path="/games" component={GameList}/>
                <ReactRouter.Route path="/lobby/:lobbyId" component={LobbyComponent} onLeave={LobbyComponent.onLeave} onEnter={LobbyComponent.onEnter}/>
                <ReactRouter.Route path="*" component={NoMatch}/>
            </ReactRouter.Route>
        </ReactRouter.Router>
    ),
    document.getElementById("content"));
