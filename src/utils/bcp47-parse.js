const { stripTo, isAlpha, isNumeric, alpha, numeric, alphabet, numerals } = require('./character-strippers');

// Parse a BCP 47 tag and return as an object in all lower case
// Ref: BCP 47, September 2009 from https://tools.ietf.org/html/bcp47

const regular = ["art-lojban","cel-gaulish","no-bok","no-nyn","zh-guoyu","zh-hakka","zh-min","zh-min-nan","zh-xiang"];
const irregular  = ["en-GB-oed","i-ami","i-bnn","i-default","i-enochian","i-hak","i-klingon","i-lux","i-mingo","i-navajo","i-pwn","i-tao","i-tay","i-tsu","sgn-BE-FR","sgn-BE-NL","sgn-CH-DE"]

const grandfathered = regular.concat(irregular);

//returns {grandfathered} or {privateUse} or {language}, all transformed to lower case
function parseTag(langtag, force) {

    const tag = cleanAndCheckTag(langtag, !!force);
    
    let lang, script, region, variants=[], extensions={}, privateUse;    

    // Search for grandfathered tags
    for (let i=0; i<grandfathered.length; i++) {
        if (tag === grandfathered[i].toLowerCase()) return {grandfathered: tag};
    }

    const subtags = lang ? [] :tag.split('-');

    // Find private use tags first, returns them {privateUse}
    // Ignore length requirement and put all the '-'s back as this doesn't create conflicts
    if (subtags[0] === 'x') {
        privateUse = subtags.join('-');
        return {
            privateUse: privateUse
        };
    }

    // Single subtag indicates only a language
    // Ignore length requirement and allow numerals, as this doesn't create conflicts
    //if (subtags.length === 1) return {language: subtags[0]};

    
    //Parse the 'language' portion of the tag

    lang = subtags.shift();

    if ((lang.length < 2 || lang.length > 3) && !force) throw new Error('Invalid primary language subtag');

    // Watch for extLang: if language is exactly 2 or 3 alphabetical characters, then up to three
    // subtags of exactly three alphabetical characters are a part of 'extlang'
    if (lang.length == 2 || lang.length == 3) {
        for (let i=1; i<=3; i++) {
            if (subtags.length && subtags[0].length===3 && isAlpha(subtags[0])) {
                lang += '-'+subtags.shift();
            }
        }
    }
        
    // 4 character subtag:
    getScript(); //only one allowed, overwrites if repeated

    // 2-3 character subtag:
    getRegion(); //only one allowed; repetition ends up throwing error

    // 5-8 characters, or 4 if it starts with a numeric
    getVariants(); // keeps adding to array; repitition later in tag doesn't restart

    // 1 character other than 'x'
    getExtensions(); // each 1 character 'key' only allowed once; overwrites if repeated

    // Finally we may have a private use at the tail
    getPrivateUse();

    //console.log({leftover: subtags});
    if (subtags.length && !force) throw new Error('End of tag could not be interpreted');

    return {
        language: lang, // 2-char language and up to three 3-char extensions, delimited by '-'
        script: script, // 4-char script
        region: region, // 2-char alpha string, or 3-char numeric string
        variants: variants, // array of 0 or more 5-to-8 char strings
        extensions: extensions, // object with 1-character keys set to any set of >1-char subtags, delimited by '-'
        privateUse: privateUse // string starting with 'x-' followed by anything else
    };

    function getScript() {
        if (subtags.length && subtags[0].length===4 && isAlpha(subtags[0]))
          script = subtags.shift();
    }

    function getRegion() {
        if (
            subtags.length && (
                (subtags[0].length===2 && isAlpha(subtags[0]))
                || (subtags[0].length===3 && isNumeric(subtags[0]))
            )
        ) region = subtags.shift();
        
    }

    function getVariants() {
        while (
            subtags.length && (
                (subtags[0].length >= 5 && subtags[0].length <= 8)
                || (subtags[0].length === 4 && isNumeric(subtags[0][0]))
            )
        ) variants.push(subtags.shift());
    }

    function getExtensions() {
        while (subtags.length>1 && subtags[0].length === 1 && subtags[0] !== 'x') {
            const extensionKey = subtags.shift();
            let extensionVals = [];
            
            while (subtags.length && subtags[0].length > 1) extensionVals.push(subtags.shift());

            if (extensions[extensionKey] && !force) throw new Error('Repeated extension key');
            extensions[extensionKey] = extensionVals.join('-');;
        } // any single 'extension' is combined back into a string of subtags delimited by '-'
    }

    function getPrivateUse() {
        if (subtags && subtags[0]==='x') {
            privateUse = subtags.join('-');
            subtags.length = 0;
        }
    }

    
}

module.exports.parseTag = parseTag;
module.exports.cleanAndCheckTag = cleanAndCheckTag;

function cleanAndCheckTag(langtag, force) {

    //BCP47 does not permit whitespace
    //const whiteSpace = ' \t\r\n\v\f';

    let tag = langtag;
    
    if (!tag) {
        if (force) tag="x-null-tag";
        else throw new Error('No language tag provided');
    }
        
    if (typeof langtag !== 'string') {
        if (force) tag="x-not-a-string";
        else throw new Error('Expected a string');
    }
    
    tag = tag.toLowerCase();

    let strippedTag = stripTo(tag, alphabet + numerals + '-');

    if (strippedTag !== tag) {
        if (force) tag = strippedTag;
        else throw new Error('Language tag had illegal characters or whitespace');
    }

    if (tag.includes('--')) {
        if (force) tag = 'x-' + tag;
        else throw new Error('Tag has an empty subtag');
    }

    if (tag && tag[0] === '-') {
        if (force) tag = 'x-' + tag;
        else throw new Error('Tag starts with an empty subtag');
    }

    if (tag && tag[tag.length-1]==='-') {
        if (force) tag = 'x-' +  tag;
        else throw new Error('Tag ends with an empty subtag');
    }
    
    return tag;

}

