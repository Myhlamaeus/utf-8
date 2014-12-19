import utf8 from "../utf-8.es";

const assert = require("assert"),
    pairs = [
        ["\u0000", utf8.fromCodePoint(0x000000)],
        ["\u007F", utf8.fromCodePoint(0x00007F)],
        ["\u0080", utf8.fromCodePoint(0x000080)],
        ["\u07FF", utf8.fromCodePoint(0x0007FF)],
        ["\u0800", utf8.fromCodePoint(0x000800)],
        ["\uFFFF", utf8.fromCodePoint(0x00FFFF)]/*,
        ["\u{010000}", utf8.fromCodePoint(0x010000)],
        ["\u{10FFFF}", utf8.fromCodePoint(0x10FFFF)]*/
    ];

describe("Strings", function() {
    describe("#fromChr()", function() {
        for(let pair of pairs) {
            it(`${pair[0].charCodeAt(0).toString(16)} -> ${pair[1].map((ele) => ele.toString(16)).join(" ")}`, function() {
                assert.deepEqual(utf8.fromChr(pair[0]), pair[1]);
            });
        }
    });

    describe("#toChr()", function() {
        for(let pair of pairs) {
            it(`${pair[1].map((ele) => ele.toString(16)).join(" ")} -> ${pair[0].charCodeAt(0).toString(16)}`, function() {
                assert.equal(utf8.toChr(pair[1]), pair[0]);
            });
        }
    });
});
