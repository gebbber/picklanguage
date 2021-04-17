const pA = require('../utils/parse-available');

test('parseAvailable requires an argument', ()=>{
    expect(()=>{pA()}).toThrow('No languages provided')
});

test('parseAvailable rejects an empty string', ()=>{
    expect(()=>{pA('')}).toThrow('No languages provided')
});

test('parseAvailable rejects an array with a falsey element', ()=>{
    expect(()=>{pA(['en-US', ''])}).toThrow('Languages array contained an empty element')
});

test('parseAvailable parses a string', ()=>{
    expect(pA('en-US')).toEqual(expect.arrayContaining([
        {language:'en', region:'us', tag: 'en-US'}
    ]));
});

test('parseAvailable parses a single-element array', ()=>{
    expect(pA(['en-US'])).toEqual(expect.arrayContaining([
        {language:'en', region:'us', tag: 'en-US'}
    ]));
});

test('parseAvailable allows a multi-element array', ()=>{
    expect(pA(['en-US', 'en-CA', 'fr-CA'])).toEqual(expect.arrayContaining([
        {language:'en', region:'us', tag: 'en-US'},
        {language:'en', region:'ca', tag: 'en-CA'},
        {language:'fr', region:'ca', tag: 'fr-CA'}
    ]));
});

test(`parseAvailable doesn't accept a wildcard`, ()=>{
    expect(()=>pA(['*', 'en-CA', 'fr-CA'])).toThrow('Language tag had illegal characters or whitespace');
});