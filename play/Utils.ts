"use strict";

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

interface Math {
    lerp(v0:number, v1:number, t:number): number;
    length(x0:number, y0:number, x1:number, y1:number): number;
}

Math.lerp = function (v0:number, v1:number, t:number) {
    return (1 - t) * v0 + t * v1;
};

Math.length = function(x0:number, y0:number, x1:number, y1:number) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
};
