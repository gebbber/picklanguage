// //From BCP 47 Appendix A: Examples
// const interpret = require('./interpret-parsed-tag');

const ex = {
    simple: ['de', 'fr', 'ja'],
    grandfathered: ['i-enochian'],
    privateTag: ['x-whatever'],
    languageScript: ['zh-Hant', 'zh-Hans', 'sr-Cyrl', 'sr-Latn'],
    extendedMandarin: ['zh-cmn-Hans-CN', 'cmn-Hans-CN'],
    extendedCantonese: ['zh-yue-HK', 'yue-HK'],
    languageScriptRegion: ['zh-Hans-CN', 'sr-Latn-RS'],
    languageVariant: ['sl-rozaj', 'sl-rozaj-biske', 'sl-nedis'],
    languageRegionVariant: ['de-CH-1901', 'sl-IT-nedis', 'hy-Latn-IT-arevela'],
    languageRegion: ['de-DE', 'en-US', 'es-419'],
    tagsWithPrivate: ['de-CH-x-phonebk', 'az-Arab-x-AZE-derbend'],
    allPrivate: ['qaa-Qaaa-QM-x-southern'],
    privateScript: ['de-Qaaa', 'sr-Qaaa-RS'],
    privateRegion: ['sr-Latn-QM'],
    extensions: ['en-US-u-islamcal', 'zh-CN-a-myext-x-private', 'en-a-myext-b-another'],
    invalidTwoRegions: ['de-419-DE'],
    invalidSingleCharacterPrimary: ['a-DE'],
    invalidDuplicateExtension: ['ar-a-aaa-b-bbb-a-ccc']
}

const output = {};
function addLine(line) { fileText += line ? line+'\n' : '\n'; }
let fileText = ``;
addLine(`const interpret = require('./interpret-parsed-tag');`);
addLine();

for (tagset in ex) {
    addLine();
    addLine(`// ${tagset} tags:`);
    for (tag of ex[tagset]) {
        addLine();
        addLine(`test('interprets tag: "${tag}"', ()=>{`);
        addLine(`    expect(interpret('${tag}')).toMatchObject({`);
        addLine(`        language: '',`);
        addLine(`        script: '',`);
        addLine(`        region: '',`);
        addLine(`        variants: [''],`);
        addLine(`        extensions: {a: '', b: ''},`);
        addLine(`        privateUse: 'x-',`);
        addLine(`    });`);
        addLine(`});`);
    }
}

// Commented out so that it doesn't overwrite the edited file:

// require('fs').appendFileSync('interpret-tag.test.js',fileText)\