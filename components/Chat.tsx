"use strict";

import ChatLog = Play.Client.ChatLog;

class ChatMessageComponent extends React.Component<ChatLog, any> {
    render() {
        var date = this.props.date;
        var formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return (
            <div>[{formattedTime}] {this.props.author}: {this.props.text}</div>
        );
    }
}

class Chat extends React.Component<any, {messageLog: ChatLog[] }> {

    constructor() {
        super();
        var lobby = ClientLobby.current;

        this.state = {
            messageLog: lobby.messageLog
        };

        lobby.changeListener.register((lobby) => {
            this.setState({
                messageLog: lobby.messageLog
            })
        });
    }

    sendMessage(e: SyntheticEvent) {
        let input = document.getElementById("chatMessage") as HTMLInputElement;
        ClientLobby.current.sendChat(input.value);
        input.value = "";
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <div>
                    {this.state.messageLog
                        .sort((a,b) => b.date.getDate() - a.date.getDate())
                        .map( (m, index) => { return <ChatMessageComponent key={index} date={m.date} text={m.text}
                                                                           author={m.author}/>
                        })}
                </div>
                <form onSubmit={this.sendMessage}>
                    <div className="input-group">
                        <input id="chatMessage" type="text" className="form-control"
                               placeholder="Type your message..."/>
                        <span className="input-group-btn">
                            <button type="submit"
                                    className="btn btn-primary btn-block glyphicon glyphicon-envelope"/>
                        </span>
                    </div>
                </form>
            </div>);
    }
}

