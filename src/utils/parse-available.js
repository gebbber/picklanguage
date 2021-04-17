const interpretTag = require('./interpret-tag');
const {stripTo, alphabet, numerals} = require('./character-strippers');

// parseAvailable throws errors for invalid tags as these are likely to be hard-coded
function parseAvailable(languages) {

    if (!languages) throw new Error('No languages provided');

    let langs;

    if (Array.isArray(languages)) {
        for (lang of languages) {
            if (!lang) throw new Error('Languages array contained an empty element');
            if (typeof lang !== 'string') throw new Error('Languages array contained a non-string');
        }
        langs = [...languages];
    } else if (typeof languages === 'string') langs = [languages];
    else throw new Error('Expecting a string or array');

    for (let i=0; i<langs.length; i++) {
        langs[i] = interpretTag(langs[i]); // don't want to use 'force' here
    }
    
    return langs;
    
}

module.exports = parseAvailable;