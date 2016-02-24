module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            "karma-jasmine",
            "karma-phantomjs-launcher"
        ],
        files: [
            "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.4/react.js",
            "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.4/react-dom.js",
            "https://npmcdn.com/history/umd/History.js",
            "https://npmcdn.com/react-router/umd/ReactRouter.js",
            "https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js",
            "https://cdn.firebase.com/js/client/2.3.2/firebase.js",
            'app/play/Server/Client.js',
            'app/play/Server/Service.js',
            'app/play/**/*.js',
            //'components/GameList.js',
            //'components/LobbyComponent.js',
            //'components/NoMatch.js',
            //'components/Header.js',
            //'components/*.js',
            'app/games/**/*.js',
            'app/**/*.test.js'
        ],
        browsers: ['Chrome'],

    });
};