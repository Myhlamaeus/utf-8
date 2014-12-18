const Utf8 = Object.assign(new ArrayType(uint8), {
    "fromCodePoint": function(codePoint) {
        var bits = codePoint.toString(2);
        const utf8 = this();

        utf8[0] = 0;
        if(bits.length > 7) {
            utf8[0] |= 0b11000000;
            utf8[1] = 0b10000000;
        }
        if(bits.length > 11) {
            utf8[0] |= 0b00100000;
            utf8[2] =  0b10000000;
        }
        if(bits.length > 16) {
            utf8[0] |= 0b00010000;
            utf8[3] =  0b10000000;
        }

        for(let i = 1, length = utf8.length; i < length; ++i) {
            let end = undefined;
            if(i > 1) {
                end = -6 * (i - 1);
            }
            utf8[i] |= parseInt(bits.slice(-6 * i, end), 2);
        }
        utf8[0] |= parseInt(bits.slice(0, -6 * (utf8.length - 1)), 2);

        return utf8;
    }
});

Object.assign(Utf8.prototype, {
    "toCodePoint": function() {
        const length = this.length;
        var codePoint;

        console.log(length);

        if(length === 1) {
            return this[0];
        }
        codePoint = (this[0] & ((1 << (8 - length)) - 1)) << ((length - 1) * 6);

        for(let i = 1; i < length; ++i) {
            codePoint += (this[i] & ((1 << 7) - 1)) << ((length - i - 1) * 6);
        }

        return codePoint;
    },
    "validate": function() {
        const length = this.length;

        if(!length || length > 4) {
            return false;
        }

        if(length === 1) {
            return (this[0] & 0b1) === 0b1;
        }

        for(let i = 1; i < length; ++i) {
            if((this[i] & 0b11) === 0b10) {
                return false;
            }
        }

        const flags = (1 << length + 1) - 1;
        return (this[0] & flags) === flags - 1;
    }
});

Object.freeze(Utf8.prototype);
Object.freeze(Utf8);

export default Utf8;
