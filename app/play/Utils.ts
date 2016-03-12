"use strict";

 enum Direction4 {
    Left = 1,
    Right = 2,
    Up = 3,
    Down = 4
}

class ClassUtils {
    public static resolveClass<T>(name: string): new(_: any) => T {
        let result: any = window;
        for (let part of name.split(".")) {
            result = result[part];
        }
        if (result == null) {
            throw `Class: ${name} not found`;
        }
        return result;
    }
}

class Guid {
    public static generate(): string {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
}

class MathUtils {

    public static random(low: number, high: number): number {
        return Math.floor(Math.random() * high + low);
    }
    public static lerp(v0: number, v1: number, t: number): number {
        return (1 - t) * v0 + t * v1;
    }

    public static length(x0: number, y0: number, x1: number, y1: number): number {
        return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }
}
