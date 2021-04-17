const parseAvailable = require('./utils/parse-available');
const parseHeader = require('./utils/parse-header');

function pick(available, preference) {
    const avail = parseAvailable(available);
    const pref = parseHeader(preference);

    // considers language, script, and region, in that order;
    // MDN says other subtags are not used on the web
    
    // go over user preferred in order of increasing preference so we overwrite lower preferences
    
    for (let a = 0; a < avail.length; a++)
    for (let p = 0; p < pref.length; p++) {
        
        let matchLevel = 0;

        if (pref[p].tag==='*') matchLevel=4;
        else if (avail[a].language === pref[p].language) {
            matchLevel = 4;
            if (avail[a].script === pref[p].script) matchLevel += 2;
            if (avail[a].region === pref[p].region) matchLevel += 1;
        }

        // matchLevel is now 0 to 3, with only language subtag being mandatory

        matchLevel *= pref[p].q;

        if (!avail[a].q || matchLevel > avail[a].q) 
            avail[a].q = matchLevel;
        
        
    }
    
    return avail.sort((a,b) => (b.q - a.q))[0].tag;
    
}

function looksLikeThis() {
    return ({
        tag: tag,
        language: parsed.language || undefined, //language and extensions, if any
        script: parsed.script || undefined,
        region: parsed.region || undefined,
        variants: parsed.variants && parsed.variants.length ? parsed.variants : undefined,
        extensions: parsed.extensions && Object.keys(parsed.extensions).length ? parsed.extensions : undefined,
        privateUse: parsed.privateUse || undefined
    });

}

module.exports = pick;