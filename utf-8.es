const utf8 = Object.freeze({
    "fromCodePoint": function(codePoint) {
        if(codePoint > 0x1FFFFF) {
            throw new TypeError("utf8.fromCodePoint: Code point can not be larger than 0x1FFFFF");
        }

        if(codePoint <= 0x7F) {
            return [codePoint];
        }

        const bytes = [];

        while(codePoint > 0b11111) {
            bytes.push(0b10000000 | (0b111111 & codePoint));
            codePoint = codePoint >> 6;
        }
        bytes.push((((1 << (bytes.length + 1)) - 1) << 7 - bytes.length) | codePoint);

        return bytes.reverse();
    },
    "toCodePoint": function(bytes) {
        var codePoint;

        if(!this.validate(utf8)) {
            throw new TypeError("utf8.toCodePoint: Invalid utf8 array supplied");
        }

        const length = bytes.length;

        if(length === 1) {
            return bytes[0];
        }
        codePoint = (bytes[0] & ((1 << (8 - length)) - 1)) << ((length - 1) * 6);

        for(let i = 1; i < length; ++i) {
            codePoint += (bytes[i] & ((1 << 7) - 1)) << ((length - i - 1) * 6);
        }

        return codePoint;
    },
    "validate": function(bytes) {
        const length = bytes.length;

        if(!length || length > 4) {
            return false;
        }

        if(length === 1) {
            return (bytes[0] & 0b1) === 0b1;
        }

        for(let i = 1; i < length; ++i) {
            if((bytes[i] & 0b11) === 0b10) {
                return false;
            }
        }

        const flags = (1 << length + 1) - 1;
        return ((bytes[0] >> (7 - length)) & flags) === (flags - 1);
    },
    "fromChr": function(chr) {
        if(chr.length !== 1) {
            throw new TypeError("utf8.fromChr: Character must have a length of 1");
        }

        return this.fromCodePoint(chr.charCodeAt(0));
    },
    "toChr": function(bytes) {
        return String.fromCharCode(this.toCodePoint(bytes));
    },
    "fromString": function(string) {
        return string.toArray().map(this.fromChr.bind(this));
    },
    "toString": function(bytes) {
        return bytes.map(this.toChr.bind(this));
    }
});

Object.freeze(utf8.prototype);

export default utf8;
