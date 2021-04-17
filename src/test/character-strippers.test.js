const {stripTo, alpha, numeric, isAlpha, isNumeric} = require('../utils/character-strippers');

test ('stripTo strips specified characters', ()=>{
    expect(stripTo('abc-def-g!h','abcdefgh-')).toBe('abc-def-gh');
});

test('stripTo throws for a non-string input', ()=>{
    expect(()=>{stripTo(['test','me'],'My input string')}).toThrow(Error);
})

test('stripTo throws for a non-string filter', ()=>{
    expect(()=>{stripTo('My input string',['test','me'])}).toThrow(Error);
})

// numeric
test('numeric leaves all numerals', ()=>{
    expect(numeric('0123456789')).toBe('0123456789');
});

test('numeric removes alphabetical', ()=>{
    expect(numeric('1a2b3c4defghijklmnop')).toBe('1234');
});

test('numeric rejects a non-string', ()=>{
    expect(()=>{numeric(123)}).toThrow(Error);
});

test('numeric rejects no argument', ()=>{
    expect(()=>{numeric()}).toThrow(Error);
});

// isnumeric
const num="0123456789";
test ('isNumeric identifies exclusively numeric', ()=>{
    expect(isNumeric(num)).toBe(true);
});

const nonNum = '123456789.0';
test ('isNumeric rejects "."', ()=>{
    expect(isNumeric(nonNum)).toBe(false);
});


test('isNumeric rejects a non-string', ()=>{
    expect(()=>{isNumeric(123)}).toThrow(Error);
});

test('isNumeric rejects no argument', ()=>{
    expect(()=>{isNumeric()}).toThrow(Error);
});

// alpha
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
test ('alpha leaves all uppercase', ()=>{
    expect(alpha(upper)).toBe(upper);
});

const lower = 'abcdefghijklmnopqrstuvwxyz'
test ('alpha leaves all lowercase', ()=>{
    expect(alpha(lower)).toBe(lower);
});

test ('alpha removes numerals', ()=>{
    expect(alpha('1a2b34c567890')).toBe('abc');
});

test('alpha rejects a non-string', ()=>{
    expect(()=>{alpha(123)}).toThrow(Error);
});

test('alpha rejects no argument', ()=>{
    expect(()=>{alpha()}).toThrow(Error);
});

// isAlpha
test ('isAlpha identifies exclusively alphabetical (uppercase)', ()=>{
    expect(isAlpha(upper)).toBe(true);
});

test ('isAlpha identifies exclusively alphabetical (lowercase)', ()=>{
    expect(isAlpha(lower)).toBe(true);
});

test ('isAlpha rejects alphabetical+"1"', ()=>{
    expect(isAlpha(lower+"1")).toBe(false);
});

test('isAlpha rejects a non-string', ()=>{
    expect(()=>{isAlpha(123)}).toThrow(Error);
});

test('isAlpha rejects no argument', ()=>{
    expect(()=>{isAlpha()}).toThrow(Error);
});