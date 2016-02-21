"use strict";

enum EnvironmentType {
    Production,
    Development
}

var environment:EnvironmentType = EnvironmentType.Production;


{
    let host = window.location.hostname;
    if (host == "http://gamesonsteroids.com/") {
        environment = EnvironmentType.Production;
    } else {
        environment = EnvironmentType.Development;
    }
}


interface IApplicationConfiguration {
    firebaseURL: string;
}
var config = new Map<EnvironmentType, IApplicationConfiguration>();
config.set(EnvironmentType.Development,
    {
        firebaseURL: "https://gos-dev.firebaseio.com/"
    });
config.set(EnvironmentType.Production,
    {
        firebaseURL: "https://games-on-steroids.firebaseio.com/"
    });


var games = [
    {
        id: "minesweeper",
        image: "https://upload.wikimedia.org/wikipedia/en/5/5c/Minesweeper_Icon.png",
        appClass: "Minesweeper.Client.MinesweeperApp",
        gameClass: "Minesweeper.Client.MinesweeperGame",
        serviceClass: "Minesweeper.Server.MinesweeperService",
        name: "Minesweeper on Steroids",
        variants: [
            {
                id: "default",
                name: "2 Players",
                maxPlayers: 2,
                width: 16,
                height: 16,
                mines: 40
            },
            {
                id: "3players",
                name: "3 Players",
                maxPlayers: 3,
                width: 16,
                height: 16,
                mines: 40
            },
            {
                id: "4players",
                name: "4 Players",
                maxPlayers: 4,
                width: 30,
                height: 16,
                mines: 99
            },
            //{
            //    id: "friend",
            //    name: "Play with friend",
            //    maxPlayers: 2,
            //    width: 10,
            //    height: 10,
            //    mines: 1
            //},
            {
                id: "solo",
                name: "1 Player",
                maxPlayers: 1,
                width: 30,
                height: 16,
                mines: 99
            },
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1,
                width: 10,
                height: 10,
                mines: 2
            },
        ]
    },
    {
        id: "chess",
        appClass: "Chess.Client.ChessApp",
        gameClass: "Chess.Client.ChessGame",
        serviceClass: "Chess.Server.ChessService",
        name: "Chess on Steroids",
        variants: [
            {
                id: "2players",
                name: "2 Players",
                maxPlayers: 2
            },
            {
                id: "4players",
                name: "4 Players",
                maxPlayers: 4,
                boardType: "4player"
            },
            {
                id: "debug",
                name: "debug",
                boardType: "4player",
                maxPlayers: 1
            }
        ]
    },
    {
        id: "anagrams",
        name: "Anagrams on Steroids",
        appClass: "Anagrams.Client.AnagramsApp",
        gameClass: "Anagrams.Client.AnagramsGame",
        serviceClass: "Anagrams.Server.AnagramsService",
        variants: [
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1
            }
        ]
    }, {
        id: "typing",
        name: "Typing on Steroids",
        variants: [
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1
            }
        ]
    }
];
