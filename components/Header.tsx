import SyntheticEvent = __React.SyntheticEvent;
"use strict";

class Header extends React.Component<any, any> {

    constructor() {
        super();

        this.onNicknameChange = this.onNicknameChange.bind(this);

        var nickname = localStorage.getItem("nickname");
        if (nickname == null || nickname == "") {
            localStorage.setItem("nickname", this.generateName());
        }

        this.state = {nickname: nickname};

    }

    generateName() {
        return "Guest #" + Math.round(Math.random() * 100);
    }


    onNicknameChange(e: SyntheticEvent) {
        var nickname = (e.target as HTMLInputElement).value;
        if (nickname == null || nickname == "") {
            nickname = this.generateName();
        }

        localStorage.setItem("nickname", nickname);
        this.setState({
            nickname: localStorage.getItem("nickname")
        });
    }

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <ReactRouter.Link className="navbar-brand" to={`/`}>Games on Steroids</ReactRouter.Link>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <form className="navbar-form navbar-right">
                            <div className="form-group">
                                <input type="text" placeholder="Nickname" className="form-control"
                                       onChange={this.onNicknameChange} value={localStorage.getItem("nickname")}
                                       autoComplete="nickname"/>
                            </div>
                        </form>
                    </div>
                </div>
            </nav>
        );
    }
}

