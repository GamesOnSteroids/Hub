"use strict";


window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
window.RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

// navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;


class App extends React.Component<any, any> {
    public render(): JSX.Element {
        return (
            <div>
                <Header />,
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
                <ReactRouter.Route path="/lobby/:lobbyId" component={LobbyComponent}/>
                <ReactRouter.Route path="*" component={NoMatch}/>
            </ReactRouter.Route>
        </ReactRouter.Router>
    ),
    document.getElementById("content"));
