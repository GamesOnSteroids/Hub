
class Header extends React.Component<any, any> {
    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <ReactRouter.Link className="navbar-brand" to={`/`}>Games on Steroids</ReactRouter.Link>
                    </div>
                </div>
            </nav>
        );
    }
}

