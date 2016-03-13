"use strict";


class FacebookLogin extends React.Component<any, {authentization: IAuthentization}> {

    constructor() {
        super();

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);

        this.checkLoginState = this.checkLoginState.bind(this);
        //this.onNicknameChange = this.onNicknameChange.bind(this);
        //
        //var nickname = localStorage.getItem("nickname");
        //if (nickname == null || nickname == "") {
        //    localStorage.setItem("nickname", this.generateName());
        //}

        this.state = {authentization: authentization};

    }


    private checkLoginState(response: any): void {
        console.log("FacebookLogin.checkLoginState", response);
        if (response.authResponse) {
            FB.api("/me", null, (response) => {
                authentization = {
                    displayName: response["name"],
                    isLoggedIn: true
                };

                this.setState({
                    authentization: authentization
                });
            });
        }
    }

    protected componentDidMount(): void {
        console.log("FB.init");
        FB.init({
            appId: config.get(environment).facebookAppId,
            cookie: true,
            xfbml: true,
            version: "v2.5"
        });

        FB.getLoginStatus(this.checkLoginState);

    }


    protected componentWillUnmount(): void {
    }

    private logout(): void {
    }
    private login(): void {
        FB.login(this.checkLoginState, {scope: "public_profile"});
    }

    public render(): JSX.Element {
        if (this.state.authentization.isLoggedIn) {
            return (
                <div>
                    <button className="btn btn-block btn-social btn-facebook" onClick={this.logout} disabled={true}>
                        <span>
                            <svg width="32" height="32" viewBox="0 0 216 216">
                                <path fill="white"
                                      d="M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9 11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1 11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2 15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3 11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"></path>
                            </svg>
                        </span>
                        {this.state.authentization.displayName}
                    </button>
                    <div id="fb-root"></div>
                </div>
            );
        } else {
            return (
                <div>
                    <button className="btn btn-block btn-social btn-facebook" onClick={this.login}>
                        <span>
                            <svg width="32" height="32" viewBox="0 0 216 216">
                                <path fill="white"
                                      d="M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9 11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1 11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2 15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3 11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"></path>
                            </svg>
                        </span>
                        Login
                    </button>
                    <div id="fb-root"></div>
                </div>
            );
        }
    }
}

