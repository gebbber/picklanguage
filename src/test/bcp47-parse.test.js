const {parseTag, cleanAndCheckTag} = require('../utils/bcp47-parse');

//cleanTag
test('clean converts tags to lower-case', ()=>{
    expect(cleanAndCheckTag('ABC-DEF-GH')).toBe('abc-def-gh');
});

test('clean provides for case-insensitivity', ()=>{
    expect(cleanAndCheckTag('ABC-DEF-GH')).toBe(cleanAndCheckTag('abc-def-gh'));
});

test('clean rejects a blank tag', ()=>{
    expect(()=>cleanAndCheckTag('')).toThrow('No language tag provided');
});

test('clean rejects no argument', ()=>{
    expect(()=>cleanAndCheckTag()).toThrow('No language tag provided');
});

test('a blank tag can be forced clean', ()=>{
    expect(cleanAndCheckTag('','force')).toBe('x-null-tag');
});

test('no argument can be forced clean', ()=>{
    expect(cleanAndCheckTag(undefined,'force')).toBe('x-not-a-string');
});

test('clean rejects a non-string', ()=>{
    expect(()=>cleanAndCheckTag(3.14)).toThrow('Expected a string');
});

test('a non-string can be forced clean', ()=>{
    expect(cleanAndCheckTag(3.14,'force')).toBe('x-not-a-string');
});

test('clean rejects illegal characters', ()=>{
    expect(()=>cleanAndCheckTag('abc-def-g!h')).toThrow();
});

test('a tag with illegal characters can be forced clean', ()=>{
    expect(cleanAndCheckTag('abc-def-g!h','force')).toBe('abc-def-gh');
});

test('clean rejects whitespace', ()=>{
    expect(()=>cleanAndCheckTag('abc-def- gh')).toThrow();
});

test('a tag with whitespace can be forced clean', ()=>{
    expect(cleanAndCheckTag('abc-def- gh','force')).toBe('abc-def-gh');
});

test('clean rejects empty subtags at beginning, middle, and end', ()=>{
    expect(()=>cleanAndCheckTag('-abc-def')).toThrow();
    expect(()=>cleanAndCheckTag('abc--def')).toThrow();
    expect(()=>cleanAndCheckTag('abc-def-')).toThrow();
});

test('tags with empty subtags at beginning, middle, and end can be forced to a private tag', ()=>{
    expect(cleanAndCheckTag('-abc-def', 'force')).toBe('x--abc-def');
    expect(cleanAndCheckTag('abc--def', 'force')).toBe('x-abc--def');
    expect(cleanAndCheckTag('abc-def-', 'force')).toBe('x-abc-def-');
});

//parseTag
test('parse rejects a blank tag', ()=>{
    expect(()=>{parseTag('')}).toThrow('No language tag provided');
});

test('parse can be forced to parse a blank tag', ()=>{
    expect(parseTag('','force')).toEqual({privateUse:'x-null-tag'});
});


test('parse rejects no argument', ()=>{
    expect(()=>{parseTag()}).toThrow('No language tag provided');
});

test('parse can be forced to parse a blank tag', ()=>{
    expect(parseTag(undefined,'force')).toEqual({privateUse:'x-not-a-string'});
});

test(`parse is eliminates case sensitivity`, ()=>{
    expect(parseTag('AB-CDE-EFG')).toEqual(parseTag('ab-cde-efg'));
})

test(`parse identifies private-use tags as 'languages'`, ()=>{
    expect(parseTag('x-greg-is-good')).toEqual({privateUse:'x-greg-is-good'});
});

test(`parse identifies grandfathered tags with uppercase in all lowercase`, ()=>{
    expect(parseTag('en-GB-oed')).toEqual({grandfathered:'en-gb-oed'});
})

test(`parse identifies grandfathered tags without case sensitivity`, ()=>{
    //listed in BCP 47 as 'en-GB-oed'
    expect(parseTag('en-gb-oed')).toEqual({grandfathered:'en-gb-oed'});
})

test(`parse identifies regular grandfathered tags as 'languages'`, ()=>{
    expect(parseTag('art-lojban')).toEqual({grandfathered:'art-lojban'});
})

test(`parse identifies irregular grandfathered tags as 'languages'`, ()=>{
    expect(parseTag('i-klingon')).toEqual({grandfathered:'i-klingon'});
})

test('parse rejects tag with uninterpretable content', ()=>{
    //expect(parseTag('en-CA-wut')).toEqual({language:'en'});
    //Throw('End of tag could not be interpreted');
    expect(()=>{parseTag('en-CA-wut')}).toThrow('End of tag could not be interpreted');
});

test('parse can be forced to ignore uninterpretable content', ()=>{
    expect(parseTag('en-CA-wut','force')).toMatchObject({language: 'en', region: 'ca'});
});

// more tests of actual returned content in interpret-tag.test.js
