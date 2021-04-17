const pickLanguage = require('../index.js');

const pl = pickLanguage;

// dummy functions cause picktranslate to return middleware
const request = (header) => {return {app: true, method: true, protocol: true, headers: {"accept-language":header}};};
const req = request("en-US");
const res = {app: true, send: true, end: true, set: true};
const next = ()=>{};

test('immediately using as middleware throws an error', ()=>{
    expect(()=>{
        pl(req, res, next)
    }).toThrow('Must set options: {strict: true} or {strict: false}');
})

test('initializing middleware with only a preferences object throws an error', ()=>{
    expect(()=>{
        pl({strict:true})(req, res, next);
    }).toThrow('No available languages specified');
})

test('initiazlizing middleware with only an available-languages array throws an error', ()=>{
    expect(()=>{
        pl(['en','fr-CA'])(req, res, next);
    }).toThrow('Must set options: {strict: true} or {strict: false}');
})

test('initializing middleware with available languages and not setting {strict:true} or {strict:false} throws an error', ()=>{
    expect(()=>{
        pl(['en','fr-CA'])({strict:null})(req, res, next)
    }).toThrow('Must set options: {strict: true} or {strict: false}');
})

test('passing strict:true and available languages and then using as middleware adds response.translate', ()=>{
    const response = {...res};
    pl(['en','fr-CA'])({strict:true})(req, response, next);
    expect(typeof response.translate).toBe('function');
})

test('passing strict:false and available languages and then using as middleware adds response.translate', ()=>{
    const response = {...res};
    pl(['en','fr-CA'])({strict:false})(req, response, next);
    expect(typeof response.translate).toBe('function');
})

test('passing strict:false and available languages and then using as middleware adds response.langTag', ()=>{
    const response = {...res};
    const req = request('fr-CA');
    pl(['en','fr-CA'])({strict:false})(req, response, next);
    expect(response.langTag).toBe('fr-CA');
})


test('res.translate with {strict: true} throws an error for any missing language', ()=>{
    const response = {...res};
    const req = request('en');
    expect(()=>{
        pl(['en','fr-CA'])({strict:true})(req, response, next);
        response.translate({en: 'english', fr: 'generic french; frCA is missing'})
    }).toThrow(`Message object is missing translation for 'fr-CA'`);
})


test('res.translate with {strict: false} translates despite a missing language', ()=>{
    const response = {...res};
    const req = request('en');
    
    pl(['en','fr-CA'])({strict:false})(req, response, next);

    expect(
        response.translate({en: 'english', fr: 'francais'})
    ).toBe(`english`);
})

test('res.translate with {strict: false} replaces a missing translation with a message', ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false})(req, response, next);

    expect(
        response.translate({en: 'english', fr: 'francais'})
    ).toBe(`(no translation)`);
})

test('res.translate with {strict: false, message: "..."} replaces a missing translation with a custom message', ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false, message:"MISSING: ${langTag}"})(req, response, next);

    expect(
        response.translate({en: 'english', fr: 'francais'})
    ).toBe(`MISSING: fr-CA`);
})

test('res.translate with {strict: false, fallback: "en"} replaces a missing translation with a custom message', ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false, fallback: 'en'})(req, response, next);

    expect(
        response.translate({en: 'english', fr: 'francais'})
    ).toBe(`english`);
})

test('res.translate with {strict: false, fallback: "en", flagMissing: true} flags the specified callback', ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false, fallback: 'en', flagMissing: true})(req, response, next);

    expect(
        response.translate({en: 'english', fr: 'francais'})
    ).toBe(`[¿«english»?]`);
})

test(`res.translate with {strict: false, fallback: 'frCA'} doesn't use a missing fallback`, ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false, fallback: 'frCA'})(req, response, next);

    expect(
        response.translate({en: 'english', fr: 'francais'})
    ).toBe(`(no translation)`);
})

test(`res.translate with {strict: false, anyFallback: true} will use any available language`, ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false, anyFallback: true})(req, response, next);

    expect(
        response.translate({en: 'english'})
    ).toBe(`english`);
})

test(`res.translate with {strict: false, anyFallback: true, flagMissing: true} will flag a fallback`, ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false, anyFallback: true, flagMissing: true})(req, response, next);

    expect(
        response.translate({en: 'english'})
    ).toBe(`[¿«english»?]`);
})

test(`res.translate with {strict: false, silent: true} will return an empty string instead of a fallback`, ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false, silent: true})(req, response, next);

    expect(
        response.translate({en: 'english'})
    ).toBe(``);
})

test(`res.translate with {strict: false, silent: true, flagMissing: true} will still be silent`, ()=>{
    const response = {...res};
    const req = request('fr');
    
    pl(['en','fr-CA'])({strict:false, silent: true, flagMissing: true})(req, response, next);

    expect(
        response.translate({en: 'english'})
    ).toBe(``);
})

// strict, message, fallback, missing,  silent
