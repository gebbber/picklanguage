const { parseTag } = require('./bcp47-parse.js');

//adds the interpretation that 'privateUse' used by itself, or any 'grandfathered'
//tag is considered to be the 'language'

function interpretTag(tag, force) {
    
    const parsed = parseTag(tag, !!force);
    
    if (parsed.grandfathered) return {language: parsed.grandfathered};
    
    if (parsed.privateUse && !parsed.language) return {language: parsed.privateUse};
    
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

module.exports = interpretTag;