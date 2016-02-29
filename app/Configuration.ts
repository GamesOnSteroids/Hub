"use strict";

enum EnvironmentType {
    Production,
    Development
}

//document.body.ontouchstart = function (e) {
//    if (e && e.preventDefault) {
//        e.preventDefault();
//    }
//    if (e && e.stopPropagation) {
//        e.stopPropagation();
//    }
//    return false;
//};
//
//document.body.ontouchmove = function (e) {
//    if (e && e.preventDefault) {
//        e.preventDefault();
//    }
//    if (e && e.stopPropagation) {
//        e.stopPropagation();
//    }
//    return false;
//};

var environment: EnvironmentType = EnvironmentType.Production;


{
    let host = window.location.hostname;
    if (host == "gamesonsteroids.com") {
        environment = EnvironmentType.Production;
    } else {
        environment = EnvironmentType.Development;
    }
}


interface IApplicationConfiguration {
    firebaseURL: string;
}

var config = new Map<EnvironmentType, IApplicationConfiguration>([
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

interface IGameConfiguration {
    id: string;
    image?: string;
    appClass?: string;
    gameClass?: string;
    serviceClass?: string;
    name: string;
    variants: any[];
    development?: boolean;
}

var gamesConfiguration: IGameConfiguration[] = [
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
            // {
            //    id: "friend",
            //    name: "Play with friend",
            //    maxPlayers: 2,
            //    width: 10,
            //    height: 10,
            //    mines: 1
            // },
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
    }

];
