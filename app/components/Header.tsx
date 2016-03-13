"use strict";

import SyntheticEvent = __React.SyntheticEvent;

class Header extends React.Component<any, any> {


    public render(): JSX.Element {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <ReactRouter.Link className="navbar-brand" to={`/`}>Games on Steroids</ReactRouter.Link>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <form className="navbar-form navbar-right">
                            <FacebookLogin />
                        </form>
                    </div>
                </div>
            </nav>
        );
    }
}

