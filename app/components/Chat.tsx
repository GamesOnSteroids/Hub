"use strict";

import ChatLog = Play.Client.ChatLog;

class ChatMessageComponent extends React.Component<ChatLog, any> {

    public render(): JSX.Element {
        var date = this.props.date;
        var formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return (
            <div>[{formattedTime}] {this.props.author}: {this.props.text}</div>
        );
    }
}

class Chat extends React.Component<any, {messageLog: ChatLog[] }> {

    private stateChangeToken: number;

    constructor() {
        super();
        let lobby = ClientLobby.current;

        this.state = {
            messageLog: lobby.messageLog
        };

        this.stateChangeToken = lobby.changeListener.register((lobby: ClientLobby) => {
            this.setState({
                messageLog: lobby.messageLog
            }, () => {
                let chatLog = document.getElementById("chatLog");
                chatLog.scrollTop = chatLog.scrollHeight;
            })
        });
    }

    protected componentWillUnmount(): void {
        let lobby = ClientLobby.current;
        lobby.changeListener.unregister(this.stateChangeToken);
    }


    public sendMessage(e: React.SyntheticEvent): void {
        let input = document.getElementById("chatMessage") as HTMLInputElement;
        ClientLobby.current.sendChat(input.value);
        input.value = "";
        e.preventDefault();
    }

    public render(): JSX.Element {
        return (
            <div>
                <div id="chatLog" style={{height: "250px", overflowY:"scroll", textAlign:"left"}}>
                    {this.state.messageLog
                        .sort((a,b) => b.date.getDate() - a.date.getDate())
                        .map( (m, index) => {
                        return <div key={index}>
                            <ChatMessageComponent date={m.date} text={m.text}
                                                  author={m.author}/>
                        </div>
                        })}
                </div>
                <form onSubmit={this.sendMessage}>
                    <div className="input-group">
                        <input id="chatMessage" type="text" className="form-control" autoComplete="off"
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

