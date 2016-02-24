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
        let lobby = ClientLobby.current;
        this.state = {
            messageLog: lobby.messageLog
        };
        this.stateChangeToken = lobby.changeListener.register((lobby) => {
            this.setState({
                messageLog: lobby.messageLog
            }, () => {
                var chatLog = document.getElementById("chatLog");
                chatLog.scrollTop = chatLog.scrollHeight;
            });
        });
    }
    componentWillUnmount() {
        let lobby = ClientLobby.current;
        lobby.changeListener.unregister(this.stateChangeToken);
    }
    sendMessage(e) {
        let input = document.getElementById("chatMessage");
        ClientLobby.current.sendChat(input.value);
        input.value = "";
        e.preventDefault();
    }
    render() {
        return (React.createElement("div", null, React.createElement("div", {"id": "chatLog", "style": { height: "250px", overflowY: "scroll", textAlign: "left" }}, this.state.messageLog
            .sort((a, b) => b.date.getDate() - a.date.getDate())
            .map((m, index) => {
            return React.createElement("div", {"key": index}, React.createElement(ChatMessageComponent, {"date": m.date, "text": m.text, "author": m.author}));
        })), React.createElement("form", {"onSubmit": this.sendMessage}, React.createElement("div", {"className": "input-group"}, React.createElement("input", {"id": "chatMessage", "type": "text", "className": "form-control", "autoComplete": "off", "placeholder": "Type your message..."}), React.createElement("span", {"className": "input-group-btn"}, React.createElement("button", {"type": "submit", "className": "btn btn-primary btn-block glyphicon glyphicon-envelope"}))))));
    }
}
//# sourceMappingURL=Chat.js.map