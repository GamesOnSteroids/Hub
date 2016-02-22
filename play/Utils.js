"use strict";
Math.guid = function () {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
};
Math.lerp = function (v0, v1, t) {
    return (1 - t) * v0 + t * v1;
};
Math.length = function (x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
};
//# sourceMappingURL=Utils.js.map