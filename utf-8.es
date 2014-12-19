const Utf8 = Object.freeze({
    "fromCodePoint": function(codePoint) {
        if(codePoint > 0x1FFFFF) {
            throw new TypeError("Utf8.fromCodePoint: Code point can not be larger than 0x1FFFFF");
        }

        if(codePoint <= 0x7F) {
            return [codePoint];
        }

        const utf8 = [];

        while(codePoint > 0b11111) {
            utf8.push(0b10000000 | (0b111111 & codePoint));
            codePoint = codePoint >> 6;
        }
        utf8.push((((1 << (utf8.length + 1)) - 1) << 7 - utf8.length) | codePoint);

        return utf8.reverse();
    },
    "toCodePoint": function(utf8) {
        var codePoint;

        if(!this.validate(utf8)) {
            throw new TypeError("utf8.toCodePoint: Invalid utf8 array supplied");
        }

        const length = utf8.length;

        if(length === 1) {
            return utf8[0];
        }
        codePoint = (utf8[0] & ((1 << (8 - length)) - 1)) << ((length - 1) * 6);

        for(let i = 1; i < length; ++i) {
            codePoint += (utf8[i] & ((1 << 7) - 1)) << ((length - i - 1) * 6);
        }

        return codePoint;
    },
    "validate": function(utf8) {
        const length = utf8.length;

        if(!length || length > 4) {
            return false;
        }

        if(length === 1) {
            return (utf8[0] & 0b1) === 0b1;
        }

        for(let i = 1; i < length; ++i) {
            if((utf8[i] & 0b11) === 0b10) {
                return false;
            }
        }

        const flags = (1 << length + 1) - 1;
        return ((utf8[0] >> (7 - length)) & flags) === (flags - 1);
    }
});

Object.freeze(Utf8.prototype);
Object.freeze(Utf8);

export default Utf8;
