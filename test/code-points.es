import utf8 from "../utf-8.es";

const assert = require("assert");

const pairs = [
        [0, [0]],
        [0x00007f, [0b01111111]],
        [0x000080, [0b11000010, 0b10000000]],
        [0x0007ff, [0b11011111, 0b10111111]],
        [0x000800, [0b11100000, 0b10100000, 0b10000000]],
        [0x00ffff, [0b11101111, 0b10111111, 0b10111111]],
        [0x010000, [0b11110000, 0b10010000, 0b10000000, 0b10000000]],
        [0x1fffff, [0b11110111, 0b10111111, 0b10111111, 0b10111111]]
    ],
    invalidUtf8Tuples = [
        [
            [0b01111111, 0b10000000]
        ], [
            [0b11000000],
            [0b11000000, 0b00000000],
            [0b11000000, 0b10000000, 0b10000000]
        ], [
            [0b11100000],
            [0b11100000, 0b10000000],
            [0b11100000, 0b10000000, 0b00000000],
            [0b11100000, 0b10000000, 0b10000000, 0b10000000]
        ], [
            [0b11110000],
            [0b11110000, 0b10000000],
            [0b11110000, 0b10000000, 0b10000000],
            [0b11110000, 0b10000000, 0b10000000, 0b00000000],
            [0b11110000, 0b10000000, 0b10000000, 0b10000000, 0b10000000]
        ]
    ];

describe("Code Points", function() {
    describe("#fromCodePoint()", function() {
        for(let pair of pairs) {
            it(`code point ${pair[0].toString(16)} -> UTF-8 ${pair[1].map((ele) => ele.toString(16)).join(" ")}`, function() {
                assert.deepEqual(utf8.fromCodePoint(pair[0]), pair[1]);
            });
        }

        it(`throws if code point lower than 0`, function() {
            assert.throws(function() {
                utf8.fromCodePoint(-1);
            }, RangeError);
        });

        it(`throws if code point higher than 0x1FFFFF`, function() {
            assert.throws(function() {
                utf8.fromCodePoint(0x200000);
            }, RangeError);
        });
    });

    describe("#toCodePoint()", function() {
        for(let pair of pairs) {
            it(`UTF-8 ${pair[1].map((ele) => ele.toString(16)).join(" ")} -> code point ${pair[0]}`, function() {
                assert.equal(utf8.toCodePoint(pair[1]), pair[0]);
            });
        }

        it(`throws if empty array`, function() {
            assert.throws(function() {
                utf8.toCodePoint([]);
            });
        }, Error);

        it(`throws if array element negative`, function() {
            assert.throws(function() {
                utf8.toCodePoint([-1]);
            });
        }, Error);

        for(let i = 0, length = invalidUtf8Tuples.length; i < length; ++i) {
            for(let tuple of invalidUtf8Tuples[i]) {
                it(`throws if byte count isn't ${i + 1} for ${tuple.map((ele) => ele.toString(16)).join(" ")}`, function() {
                    assert.throws(function() {
                        utf8.toCodePoint(tuple);
                    }, Error);
                });
            }
        }
    });
})
