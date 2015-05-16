/* global it, describe */

import * as utf8 from '../../utf-8'

const assert = require('assert')
const pairs = [
  [0, new Uint8Array([0])],
  [0x00007f, new Uint8Array([0b01111111])],
  [0x000080, new Uint8Array([0b11000010, 0b10000000])],
  [0x0007ff, new Uint8Array([0b11011111, 0b10111111])],
  [0x000800, new Uint8Array([0b11100000, 0b10100000, 0b10000000])],
  [0x00ffff, new Uint8Array([0b11101111, 0b10111111, 0b10111111])],
  [0x010000, new Uint8Array([0b11110000, 0b10010000, 0b10000000, 0b10000000])],
  [0x10ffff, new Uint8Array([0b11110100, 0b10001111, 0b10111111, 0b10111111])]
]

const invalidUtf8Tuples = [
  [
    new Uint8Array([0b01111111, 0b10000000])
  ], [
    new Uint8Array([0b11000000]),
    new Uint8Array([0b11000000, 0b00000000]),
    new Uint8Array([0b11000000, 0b10000000, 0b10000000])
  ], [
    new Uint8Array([0b11100000]),
    new Uint8Array([0b11100000, 0b10000000]),
    new Uint8Array([0b11100000, 0b10000000, 0b00000000]),
    new Uint8Array([0b11100000, 0b10000000, 0b10000000, 0b10000000])
  ], [
    new Uint8Array([0b11110000]),
    new Uint8Array([0b11110000, 0b10000000]),
    new Uint8Array([0b11110000, 0b10000000, 0b10000000]),
    new Uint8Array([0b11110000, 0b10000000, 0b10000000, 0b00000000]),
    new Uint8Array([0b11110000, 0b10000000, 0b10000000, 0b10000000, 0b10000000])
  ]
]

describe('Code Points', function () {
  describe('#fromCodePoint()', function () {
    for (let pair of pairs) {
      it(`code point ${pair[0].toString(16)} -> UTF-8 ${Array.from(pair[1]).map((ele) => ele.toString(16)).join(' ')}`, function () {
        assert.deepEqual(utf8.fromCodePoint(pair[0]), pair[1])
      })
    }

    it(`throws if code point lower than 0`, function () {
      assert.throws(function () {
        utf8.fromCodePoint(-1)
      }, RangeError)
    })

    it(`throws if code point higher than 0x10FFFF`, function () {
      assert.throws(function () {
        utf8.fromCodePoint(0x110000)
      }, RangeError)
    })
  })

  describe('#toCodePoint()', function () {
    for (let pair of pairs) {
      it(`UTF-8 ${Array.from(pair[1]).map((ele) => ele.toString(16)).join(' ')} -> code point ${pair[0]}`, function () {
        assert.equal(utf8.toCodePoint(pair[1]), pair[0])
      })
    }

    it(`works for Array and Uint8Array`, function () {
      for (let pair of pairs) {
        assert.equal(utf8.toCodePoint(Array.from(pair[1])), pair[0])
      }
    })

    it(`throws if not an array`, function () {
      assert.throws(function () {
        utf8.toCodePoint()
      }, TypeError)
      assert.throws(function () {
        utf8.toCodePoint(0)
      }, TypeError)
      assert.throws(function () {
        utf8.toCodePoint(null)
      }, TypeError)
      assert.throws(function () {
        utf8.toCodePoint({})
      }, TypeError)
      assert.throws(function () {
        utf8.toCodePoint('')
      }, TypeError)
    })

    it(`throws if empty array`, function () {
      assert.throws(function () {
        utf8.toCodePoint([])
      }, Error)
    })

    it(`throws if array element negative`, function () {
      assert.throws(function () {
        utf8.toCodePoint([-1])
      }, Error)
    })

    for (let i = 0, length = invalidUtf8Tuples.length; i < length; ++i) {
      for (let tuple of invalidUtf8Tuples[i]) {
        it(`throws if byte count isn't ${i + 1} for ${Array.from(tuple).map((ele) => ele.toString(16)).join(' ')}`, function () {
          assert.throws(function () {
            utf8.toCodePoint(tuple)
          }, Error)
        })
      }
    }
  })
})
