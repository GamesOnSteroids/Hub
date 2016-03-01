"use strict";
var EnvironmentType;
(function (EnvironmentType) {
    EnvironmentType[EnvironmentType["Production"] = 0] = "Production";
    EnvironmentType[EnvironmentType["Development"] = 1] = "Development";
})(EnvironmentType || (EnvironmentType = {}));
var environment = EnvironmentType.Production;
{
    let host = window.location.hostname;
    if (host == "gamesonsteroids.com") {
        environment = EnvironmentType.Production;
    }
    else {
        environment = EnvironmentType.Development;
    }
}
var config = new Map([
    [
        EnvironmentType.Development,
        {
            firebaseURL: "https://gos-dev.firebaseio.com/",
        },
    ],
    [
        EnvironmentType.Production,
        {
            firebaseURL: "https://games-on-steroids.firebaseio.com/",
        },
    ],
]);
var gamesConfiguration = [
    {
        id: "minesweeper",
        image: "https://upload.wikimedia.org/wikipedia/en/5/5c/Minesweeper_Icon.png",
        appClass: "Minesweeper.Client.MinesweeperApp",
        gameClass: "Minesweeper.Client.MinesweeperGame",
        serviceClass: "Minesweeper.Server.MinesweeperService",
        name: "Minesweeper",
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
                id: "team2player",
                name: "2 Players (Team Game)",
                maxPlayers: 2,
                width: 16,
                height: 16,
                mines: 40,
                teamCount: 1
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
                development: true,
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
        name: "Chess",
        variants: [
            {
                id: "default",
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
                development: true,
                maxPlayers: 2
            }
        ]
    },
    {
        id: "anagrams",
        name: "Anagrams",
        appClass: "Anagrams.Client.AnagramsApp",
        gameClass: "Anagrams.Client.AnagramsGame",
        serviceClass: "Anagrams.Server.AnagramsService",
        development: true,
        variants: [
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1,
                development: true
            }
        ]
    }, {
        id: "typing",
        name: "Typing",
        development: true,
        variants: [
            {
                id: "debug",
                name: "debug",
                maxPlayers: 1,
                development: true
            }
        ]
    }, {
        "id": "mahjong",
        "name": "Mahjong",
        "appClass": "Mahjong.Client.MahjongApp",
        "gameClass": "Mahjong.Client.MahjongGame",
        "serviceClass": "Mahjong.Server.MahjongService",
        development: true,
        "variants": [{
                "id": "debug",
                "name": "debug",
                "maxPlayers": 1,
                development: true,
            }]
    }, {
        "id": "tetrominoes",
        "name": "Tetrominoes",
        "appClass": "Tetrominoes.Client.TetrominoesApp",
        "gameClass": "Tetrominoes.Client.TetrominoesGame",
        "serviceClass": "Tetrominoes.Server.TetrominoesService",
        "variants": [{
                "id": "default",
                "name": "2 Players",
                "maxPlayers": 2,
                "gravity": 1 / 512,
                "width": 10,
                "height": 20,
            }, {
                "id": "2playerteam",
                "name": "2 Players (Team Game)",
                "maxPlayers": 2,
                "gravity": 1 / 512,
                "width": 10,
                "height": 20,
                teamCount: 1
            }, {
                "id": "1player",
                "name": "1 Player",
                "maxPlayers": 1,
                "gravity": 1 / 512,
                "width": 10,
                "height": 20,
            }, {
                "id": "4players",
                "name": "4 Player",
                "maxPlayers": 4,
                "gravity": 1 / 512,
                "width": 16,
                "height": 20,
            }, {
                "id": "debug",
                "name": "debug",
                "maxPlayers": 1,
                "gravity": 1 / 512,
                "width": 10,
                "height": 20,
                development: true,
            }]
    }, {
        "id": "runner",
        "name": "Runner",
        "variants": [],
    }
];
