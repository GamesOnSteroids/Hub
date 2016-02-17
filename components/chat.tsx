"use strict";

class Chat extends React.Component<any, any> {
    render() {
        return (
            <div>
                <textarea className="form-control"></textarea>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Type your message..."/>
                    <span className="input-group-btn">
                        <button
                            className="btn  btn-primary btn-block glyphicon glyphicon-envelope"></button>
                    </span>
                </div>
            </div>);
    }
}

