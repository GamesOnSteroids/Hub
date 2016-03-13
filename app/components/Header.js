"use strict";
class Header extends React.Component {
    render() {
        return (React.createElement("nav", {className: "navbar navbar-inverse navbar-fixed-top"}, React.createElement("div", {className: "container"}, React.createElement("div", {className: "navbar-header"}, React.createElement(ReactRouter.Link, {className: "navbar-brand", to: `/`}, "Games on Steroids")), React.createElement("div", {id: "navbar", className: "navbar-collapse collapse"}, React.createElement("form", {className: "navbar-form navbar-right"}, React.createElement(FacebookLogin, null))))));
    }
}
