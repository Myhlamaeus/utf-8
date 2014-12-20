import utf8 from "../utf-8.es6";

const assert = require("assert"),
    chrPairs = [
        ["\u0000", utf8.fromCodePoint(0x000000)],
        ["\u007F", utf8.fromCodePoint(0x00007F)],
        ["\u0080", utf8.fromCodePoint(0x000080)],
        ["\u07FF", utf8.fromCodePoint(0x0007FF)],
        ["\u0800", utf8.fromCodePoint(0x000800)],
        ["\uFFFF", utf8.fromCodePoint(0x00FFFF)],
        [String.fromCodePoint(0x010000), utf8.fromCodePoint(0x010000)],
        [String.fromCodePoint(0x10FFFF), utf8.fromCodePoint(0x10FFFF)]
    ],
    strPairs = [
        ["\u0000\u0000", [utf8.fromCodePoint(0x000000), utf8.fromCodePoint(0x000000)]],
        ["\u007F\u007F", [utf8.fromCodePoint(0x00007F), utf8.fromCodePoint(0x00007F)]],
        ["\u0080\u0080", [utf8.fromCodePoint(0x000080), utf8.fromCodePoint(0x000080)]],
        ["\u07FF\u07FF", [utf8.fromCodePoint(0x0007FF), utf8.fromCodePoint(0x0007FF)]],
        ["\u0800\u0800", [utf8.fromCodePoint(0x000800), utf8.fromCodePoint(0x000800)]],
        ["\uFFFF\uFFFF", [utf8.fromCodePoint(0x00FFFF), utf8.fromCodePoint(0x00FFFF)]],
        [String.fromCodePoint(0x010000).repeat(2), [utf8.fromCodePoint(0x010000), utf8.fromCodePoint(0x010000)]],
        [String.fromCodePoint(0x10FFFF).repeat(2), [utf8.fromCodePoint(0x010FFFF), utf8.fromCodePoint(0x010FFFF)]]
    ];

describe("Strings", function() {
    describe("#fromChr()", function() {
        for(let pair of chrPairs) {
            it(`${pair[0].codePointAt(0).toString(16)} -> ${Array.from(pair[1]).map((ele) => ele.toString(16)).join(" ")}`, function() {
                assert.deepEqual(utf8.fromChr(pair[0]), pair[1]);
            });
        }

        it(`throws if not a string`, function() {
            assert.throws(function() {
                utf8.fromChr();
            }, TypeError);
            assert.throws(function() {
                utf8.fromChr(0);
            }, TypeError);
            assert.throws(function() {
                utf8.fromChr(null);
            }, TypeError);
            assert.throws(function() {
                utf8.fromChr({});
            }, TypeError);
        });

        it(`throws if string empty`, function() {
            assert.throws(function() {
                utf8.fromChr("");
            }, RangeError);
        });

        it(`throws if length is not 1 for BMP character`, function() {
            assert.throws(function() {
                utf8.fromChr("aa");
            }, RangeError);
        });

        it(`throws if length is not 2 for non-BMP character`, function() {
            assert.throws(function() {
                utf8.fromChr(String.fromCodePoint(0x010000).repeat(3));
            }, RangeError);
        });
    });

    describe("#toChr()", function() {
        for(let pair of chrPairs) {
            it(`${Array.from(pair[1]).map((ele) => ele.toString(16)).join(" ")} -> ${pair[0].codePointAt(0).toString(16)}`, function() {
                assert.equal(utf8.toChr(pair[1]), pair[0]);
            });
        }
    });

    describe("#parse()", function() {
        for(let pair of strPairs) {
            it(`${pair[0].split("").map((chr) => chr.codePointAt(0).toString(16)).join("")} -> ${Array.from(pair[1]).map((ele) => Array.from(ele).map((ele) => ele.toString(16))).join(" ")}`, function() {
                assert.deepEqual(utf8.parse(pair[0]), pair[1]);
            });
        }
    });

    describe("#stringify()", function() {
        for(let pair of strPairs) {
            it(`${Array.from(pair[1]).map((ele) => Array.from(ele).map((ele) => ele.toString(16))).join(" ")} -> ${pair[0].split("").map((chr) => chr.codePointAt(0).toString(16)).join("")}`, function() {
                assert.equal(utf8.stringify(pair[1]), pair[0]);
            });
        }
    });
});
