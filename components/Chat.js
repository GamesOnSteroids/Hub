"use strict";
var ChatLog = Play.Client.ChatLog;
class ChatMessageComponent extends React.Component {
    render() {
        var date = this.props.date;
        var formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return (React.createElement("div", null, "[", formattedTime, "] ", this.props.author, ": ", this.props.text));
    }
}
class Chat extends React.Component {
    constructor() {
        super();
        var lobby = ClientLobby.current;
        this.state = {
            messageLog: lobby.messageLog
        };
        lobby.changeListener.register((lobby) => {
            this.setState({
                messageLog: lobby.messageLog
            });
        });
    }
    sendMessage(e) {
        let input = document.getElementById("chatMessage");
        ClientLobby.current.sendChat(input.value);
        input.value = "";
        e.preventDefault();
    }
    render() {
        return (React.createElement("div", null, React.createElement("div", null, this.state.messageLog
            .sort((a, b) => b.date.getDate() - a.date.getDate())
            .map((m, index) => {
            return React.createElement(ChatMessageComponent, {"key": index, "date": m.date, "text": m.text, "author": m.author});
        })), React.createElement("form", {"onSubmit": this.sendMessage}, React.createElement("div", {"className": "input-group"}, React.createElement("input", {"id": "chatMessage", "type": "text", "className": "form-control", "placeholder": "Type your message..."}), React.createElement("span", {"className": "input-group-btn"}, React.createElement("button", {"type": "submit", "className": "btn btn-primary btn-block glyphicon glyphicon-envelope"}))))));
    }
}
//# sourceMappingURL=Chat.js.map