const { stripTo, alphabet, numerals } = require('./character-strippers');
const interpretTag = require('./interpret-tag');

// parseHeader forces interpretation of tags without throwing errors because of user input
function parseHeader(langHeader) {

    if (!langHeader || typeof langHeader !== 'string') return [];

    const lh = stripTo(langHeader.toLowerCase(), alphabet + numerals + '*-=,.;');
    
    const userLangs = lh.split(',')
    .map(lang => ({
        tag: lang.split(';q=')[0],
        q: Number(lang.split(';q=')[1]) || 1 
    }))
    .sort((a,b) => (b.q - a.q));

    for (let i=0; i< userLangs.length; i++) {
        if (userLangs[i].tag !== '*') userLangs[i] = {
            ...userLangs[i], 
            ...interpretTag(userLangs[i].tag, 'force')
        } 
    }
    
    return userLangs;
}

module.exports = parseHeader;