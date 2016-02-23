"use strict";
var Direction4;
(function (Direction4) {
    Direction4[Direction4["Left"] = 1] = "Left";
    Direction4[Direction4["Right"] = 2] = "Right";
    Direction4[Direction4["Up"] = 3] = "Up";
    Direction4[Direction4["Down"] = 4] = "Down";
})(Direction4 || (Direction4 = {}));
class ClassUtils {
    static resolveClass(name) {
        let result = window;
        for (let part of name.split(".")) {
            result = result[part];
        }
        if (result == undefined) {
            throw `Class: ${name} not found`;
        }
        return result;
    }
}
class Guid {
    static generate() {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
}
class MathUtils {
    static lerp(v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    }
    static length(x0, y0, x1, y1) {
        return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }
}
//# sourceMappingURL=Utils.js.map