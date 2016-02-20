import ReactElement = __React.ReactElement;
"use strict";
class GameList extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {

        return (
            <div className="row">
                {games.map( (game, index) => {
                    let result:JSX.Element[] = [];
                    index++;

                    result.push(
                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                        <GameDescription game={game}/>
                    </div>);
                    if (index % 4 == 0) {
                        result.push(<div className="visible-lg clearfix divider"></div>);
                    }
                    if (index % 3 == 0) {
                        result.push(<div className="visible-md clearfix divider"></div>);
                    }
                    if (index % 2 == 0) {
                        result.push(<div className="visible-sm clearfix divider"></div>);
                    }
                    result.push(<div className="visible-xs clearfix divider"></div>);

                    return result})}
            </div>
        );
    }
}
