const ph = require('../utils/parse-header');

test('parseHeader throws an error if given a non-string',()=>{
    expect(()=>{ph()}).toThrow('Expecting a string');
});

test('parseHeader ignores whitespace gracefully',()=>{
    const langHeader = 'en;q=0.8,     sv';
    const res = ph(langHeader);
    const check = res[1].language==='en';
    expect(check).toBe(true);
});

test('parseHeader ignores invalid characters gracefully',()=>{
    expect(
        ph('en;q=0.8!,sv')[1]
        .q === 0.8
    ).toBe(true);
});

test('parseHeader ignores empty tags gracefully',()=>{
    const res = ph(',en;q=0.8,sv');
    
    const check = res[0].language==='x-null-tag' 
                  && res[1].language==='sv' 
                  && res[2].language==='en';

    expect(check).toBe(true);
});


test('parseHeader re-orders out-of-order quality ratings',()=>{
    const res = ph('en-GB,en;q=0.8!,sv');

    const check = res[0].q >= res[1].q 
                  && res[1].q >= res[2].q;

    expect(check).toBe(true);
});

test(`parseHeader doesn't attempt to parse a wildcard`,()=>{
    const res = ph('en-GB,en;q=0.8!,sv,*;q=0.9');

    const check = res[2].tag==='*' && !res[2].langauge;

    expect(check).toBe(true);
});

// not sure how to write proper jest tests to check values of nested objects
// and arrays; the above is not elegant or particularly readable, but works.
