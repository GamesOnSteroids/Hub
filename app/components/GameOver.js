"use strict";
class GameOver extends React.Component {
    render() {
        var overlayStyle = {
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0,
            top: 0,
            background: "rgba(1,1,1,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            textAlign: "center"
        };
        return (React.createElement("div", {style: overlayStyle}, React.createElement("div", null, React.createElement("h2", null, "GAME OVER"), React.createElement("br", null), React.createElement("button", {className: "btn btn-default", type: "submit", onClick: this.props.onBackToLobby}, "Back to Lobby"))));
    }
}
