namespace Mahjong.Test {
    "use strict";

    describe("myFunction", () => {
        let hand = new Mahjong.Client.Hand();
;
        beforeEach(() => {
            //spyOn(hand, "someMethod").andCallThrough();
        });

        afterEach(() => {

        });

        it("should be able to initialize", () => {
            expect(hand.tiles).not.toBeNull();
        });

        it("should populate stuff during initialization", () => {
            expect(hand.someMethod()).toEqual("taest");
        });

    });
}
