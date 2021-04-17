const interpret = require('../utils/interpret-tag');


// simple tags:
test('interprets tag: "de"', ()=>{
    expect(interpret('de')).toMatchObject({
        language: 'de'
    });
});

test('interprets tag: "fr"', ()=>{
    expect(interpret('fr')).toMatchObject({
        language: 'fr'
    });
});

test('interprets tag: "ja"', ()=>{
    expect(interpret('ja')).toMatchObject({
        language: 'ja'
    });
});


// grandfathered tags:
test('interprets tag: "i-enochian"', ()=>{
    expect(interpret('i-enochian')).toMatchObject({
        language: 'i-enochian'
    });
});


// privateTag tags:
test('interprets tag: "x-whatever"', ()=>{
    expect(interpret('x-whatever')).toMatchObject({
        language: 'x-whatever'
    });
});


// language-script tags:
test('interprets tag: "zh-Hant"', ()=>{
    expect(interpret('zh-Hant')).toMatchObject({
        language: 'zh', script: 'hant'
    });
});

test('interprets tag: "zh-Hans"', ()=>{
    expect(interpret('zh-Hans')).toMatchObject({
        language: 'zh', script: 'hans'
    });
});

test('interprets tag: "sr-Cyrl"', ()=>{
    expect(interpret('sr-Cyrl')).toMatchObject({
        language: 'sr', script: 'cyrl'
    });
});

test('interprets tag: "sr-Latn"', ()=>{
    expect(interpret('sr-Latn')).toMatchObject({
        language: 'sr', script: 'latn'
    });
});


// extended tags: Mandarin
test('interprets tag: "zh-cmn-Hans-CN"', ()=>{
    expect(interpret('zh-cmn-Hans-CN')).toMatchObject({
        language: 'zh-cmn', script: 'hans', region: 'cn'
    });
});

test('interprets tag: "cmn-Hans-CN"', ()=>{
    expect(interpret('cmn-Hans-CN')).toMatchObject({
        language: 'cmn', script: 'hans', region: 'cn'
    });
});


// extended tags: Cantonese
test('interprets tag: "zh-yue-HK"', ()=>{
    expect(interpret('zh-yue-HK')).toMatchObject({
        language: 'zh-yue', region: 'hk'
    });
});

test('interprets tag: "yue-HK"', ()=>{
    expect(interpret('yue-HK')).toMatchObject({
        language: 'yue', region: 'hk'
    });
});


// language-script-region tags:
test('interprets tag: "zh-Hans-CN"', ()=>{
    expect(interpret('zh-Hans-CN')).toMatchObject({
        language: 'zh', script: 'hans', region: 'cn'
    });
});

test('interprets tag: "sr-Latn-RS"', ()=>{
    expect(interpret('sr-Latn-RS')).toMatchObject({
        language: 'sr', script: 'latn', region: 'rs'
    });
});


// languageVariant tags:
test('interprets tag: "sl-rozaj"', ()=>{
    expect(interpret('sl-rozaj')).toMatchObject({
        language: 'sl',
        variants: ['rozaj']
    });
});

test('interprets tag: "sl-rozaj-biske"', ()=>{
    expect(interpret('sl-rozaj-biske')).toMatchObject({
        language: 'sl',
        variants: ['rozaj','biske']
    });
});

test('interprets tag: "sl-nedis"', ()=>{
    expect(interpret('sl-nedis')).toMatchObject({
        language: 'sl',
        variants: ['nedis']
    });
});


// language-region-variant tags:
test('interprets tag: "de-CH-1901"', ()=>{
    expect(interpret('de-CH-1901')).toMatchObject({
        language: 'de', region: 'ch',
        variants: ['1901']
    });
});

test('interprets tag: "sl-IT-nedis"', ()=>{
    expect(interpret('sl-IT-nedis')).toMatchObject({
        language: 'sl', region: 'it',
        variants: ['nedis']
    });
});

test('interprets tag: "hy-Latn-IT-arevela"', ()=>{
    expect(interpret('hy-Latn-IT-arevela')).toMatchObject({
        language: 'hy', script: 'latn', region: 'it',
        variants: ['arevela'],
    });
});


// language-region tags:
test('interprets tag: "de-DE"', ()=>{
    expect(interpret('de-DE')).toMatchObject({
        language: 'de', region: 'de'
    });
});

test('interprets tag: "en-US"', ()=>{
    expect(interpret('en-US')).toMatchObject({
        language: 'en', region: 'us'
    });
});

test('interprets tag: "es-419"', ()=>{
    expect(interpret('es-419')).toMatchObject({
        language: 'es', region: '419'
    });
});


// tags with private-use subtags:
test('interprets tag: "de-CH-x-phonebk"', ()=>{
    expect(interpret('de-CH-x-phonebk')).toMatchObject({
        language: 'de',
        region: 'ch',
        privateUse: 'x-phonebk'
    });
});

test('interprets tag: "az-Arab-x-AZE-derbend"', ()=>{
    expect(interpret('az-Arab-x-AZE-derbend')).toMatchObject({
        language: 'az',
        script: 'arab',
        privateUse: 'x-aze-derbend'
    });
});


// all-private tags:
test('interprets tag: "qaa-Qaaa-QM-x-southern"', ()=>{
    expect(interpret('qaa-Qaaa-QM-x-southern')).toMatchObject({
        language: 'qaa',
        script: 'qaaa',
        region: 'qm',
        privateUse: 'x-southern',
    });
});


// private script tags:
test('interprets tag: "de-Qaaa"', ()=>{
    expect(interpret('de-Qaaa')).toMatchObject({
        language: 'de',
        script: 'qaaa'
    });
});

test('interprets tag: "sr-Qaaa-RS"', ()=>{
    expect(interpret('sr-Qaaa-RS')).toMatchObject({
        language: 'sr',
        script: 'qaaa',
        region: 'rs'
    });
});

// private region tags:
test('interprets tag: "sr-Latn-QM"', ()=>{
    expect(interpret('sr-Latn-QM')).toMatchObject({
        language: 'sr',
        script: 'latn',
        region: 'qm'
    });
});


// tags with extensions:
test('interprets tag: "en-US-u-islamcal"', ()=>{
    expect(interpret('en-US-u-islamcal')).toMatchObject({
        language: 'en',
        region: 'us',
        extensions: {u: 'islamcal'}
    });
});

test('interprets tag: "zh-CN-a-myext-x-private"', ()=>{
    expect(interpret('zh-CN-a-myext-x-private')).toMatchObject({
        language: 'zh',
        region: 'cn',
        extensions: {a: 'myext'},
        privateUse: 'x-private',
    });
});

test('interprets tag: "en-a-myext-b-another"', ()=>{
    expect(interpret('en-a-myext-b-another')).toMatchObject({
        language: 'en',
        extensions: {a: 'myext', b: 'another'}
    });
});


// invalid two-region tags:
test('rejects tag with second region; tag: "de-419-DE"', ()=>{
    expect(()=>{interpret('de-419-DE')}).toThrow('End of tag could not be interpreted');
});

// invalidSingleCharacterPrimary tags:
test('rejects single-character primary language; tag: "a-DE"', ()=>{
    expect(()=>{interpret('a-DE')}).toThrow('Invalid primary language subtag');
});

// invalidDuplicateExtension tags:
test('rejects duplicate extensions; tag: "ar-a-aaa-b-bbb-a-ccc"', ()=>{
    expect(()=>{interpret('ar-a-aaa-b-bbb-a-ccc')}).toThrow('Repeated extension key');
});


// test('interprets tag: "ar-a-aaa-b-bbb-a-ccc"', ()=>{
//     expect(interpret('ar-a-aaa-b-bbb-a-ccc')).toMatchObject({
//         language: 'ar',
//         script: '',
//         region: '',
//         variants: [''],
//         extensions: {a: '', b: ''},
//         privateUse: 'x-',
//     });
// });
