import * as utf8 from "../utf-8";
import stringToCodePointArray from "../bower_components/string-to-code-point-array/string-to-code-point-array.es6";

const padHex = function(str) {
        if(str.length < 2) {
            return "0".repeat(2 - str.length) + str;
        }
        return str;
    },
    arrayToHex = function(arr) {
        if(Array.isArray(arr[0]) || arr[0] instanceof Uint8Array) {
            return Array.from(arr).map(arrayToHex).join(", ");
        }

        return Array.from(arr).map((codePoint) => codePoint.toString(16).split("").reverse().join("").match(/[0-9a-f]{1,2}/ig).map((pair) => pair.split("").reverse().join("")).reverse().map(padHex).join(" ")).join(" ");
    },
    stringToHex = function(str) {
        return arrayToHex(stringToCodePointArray(str));
    },
    assert = require("assert"),
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
            it(`${stringToHex(pair[0])} -> ${arrayToHex(pair[1])}`, function() {
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
            it(`${arrayToHex(pair[1])} -> ${stringToHex(pair[0])}`, function() {
                assert.equal(utf8.toChr(pair[1]), pair[0]);
            });
        }
    });

    describe("#parse()", function() {
        for(let pair of strPairs) {
            it(`${stringToHex(pair[0])} -> ${arrayToHex(pair[1])}`, function() {
                assert.deepEqual(utf8.parse(pair[0]), pair[1]);
            });
        }
    });

    describe("#stringify()", function() {
        for(let pair of strPairs) {
            it(`${arrayToHex(pair[1])} -> ${stringToHex(pair[0])}`, function() {
                assert.equal(utf8.stringify(pair[1]), pair[0]);
            });
        }
    });
});
