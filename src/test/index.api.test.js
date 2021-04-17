const pickLanguage = require('../index.js');

const pl = pickLanguage;

test('immediately passing a preference string throws an error', ()=>{
    expect(()=>{
        pl("en-GB")
    }).toThrow('No available languages specified');
})

test('passing an array and then a preference string returns {translate: ()}', ()=>{
    expect(typeof
        pl(['en','fr-CA'])('fr').translate
    ).toBe('function');
})

test('passing {strict: true} and then an array and then a preference string returns {translate: ()}', ()=>{
    expect(typeof
        pl(['en','fr-CA'])({strict:true})('fr').translate
    ).toBe('function');
})

test('passing {strict: false} and then an array and then a preference string returns {translate: ()}', ()=>{
    expect(typeof
        pl(['en','fr-CA'])({strict:false})('fr').translate
    ).toBe('function');
})

test('the translator returned with {strict: true} throws an error when translating an object with a missing language', ()=>{
    expect(()=>{
        pl(['en','fr-CA'])({strict:true})('en').translate({en: 'english', fr: 'generic french; frCA is missing'})
    }).toThrow(`Message object is missing translation for 'fr-CA'`);
})

test('the translator returned with {strict: false} translates an object that is a missing language', ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false})('en').translate({en: 'english', fr: 'francais'}) //frCA translation is missing
    ).toBe(`english`);
})

test('the translator returned with {strict: false} replaces a missing translation with a message', ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false})('fr').translate({en: 'english', fr: 'francais'}) //frCA translation is missing
    ).toBe(`(no translation)`);
})

test('the translator returned with {strict: false, message: "..."} replaces a missing translation with a custom message', ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false, message:"MISSING: ${langTag}"})('fr').translate({en: 'english', fr: 'francais'}) //frCA translation is missing
    ).toBe(`MISSING: fr-CA`);
})

test(`the translator returned with {strict: false, fallback: 'en'} uses the specified fallback`, ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false, fallback:'en'})('fr').translate({en: 'english', fr: 'francais'}) //frCA translation is missing
    ).toBe(`english`);
})

test(`the translator returned with {strict: false, fallback: 'en', flagMissing: true} flags the specified fallback`, ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false, fallback:'en', flagMissing: true})('fr').translate({en: 'english', fr: 'francais'}) //frCA translation is missing
    ).toBe(`[¿«english»?]`);
})

test(`the translator returned with {strict: false, fallback: 'frCA'} doesn't use a missing fallback`, ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false, fallback:'frCA'})('fr').translate({en: 'english', fr: 'francais'}) //frCA translation is missing
    ).toBe(`(no translation)`);
})

test(`the translator returned with {strict: false, anyFallback: true} will use any available language`, ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false, anyFallback: true})('fr').translate({en: 'english'}) //frCA translation is missing
    ).toBe(`english`);
})

test(`the translator returned with {strict: false, anyFallback: true, flagMissing: true} will flag a fallback`, ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false, anyFallback: true, flagMissing: true})('fr').translate({en: 'english'}) //frCA translation is missing
    ).toBe(`[¿«english»?]`);
})

test(`the translator returned with {strict: false, silent: true} return an empty string instead of a fallback`, ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false, silent: true})('fr').translate({en: 'english'}) //frCA translation is missing
    ).toBe(``);
})

test(`the translator returned with {strict: false, silent: true, flagMissing: true} will still be silent`, ()=>{
    expect(
        pl(['en','fr-CA'])({strict:false, silent: true, flagMissing: true})('fr').translate({en: 'english'}) //frCA translation is missing
    ).toBe(``);
})

// strict, message, fallback, flagMissing,  silent
