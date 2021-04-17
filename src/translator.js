const {alphabet, numerals, isNumeric, stripTo} = require('./utils/character-strippers');


module.exports = translator;

function translator(langTag, available, options) {
    
    const strict = options && options.strict;
    const fallback = options && options.fallback && typeof options.fallback === 'string' && options.fallback;
    const anyFallback = options && options.anyFallback;
    const flagMissing = options && options.flagMissing;
    const message = options && options.message && typeof options.message === 'string' && options.message;
    const silent = options && options.silent || false;
    
    return translate;

    function translate(Message) {
        
        if (!Message || typeof Message !== 'object' || Message === null) throw new Error('Message was not passed as an object');

        //look for missing translations if have options: {strict: true}
        if (strict) {
            
            if (fallback && !Message[lprop(fallback)]) throw new Error(`Message object is missing translation for fallback language ${fallback}`);
            
            for (la of available) {
                const prop = lprop(la.tag);
                if (!Message[prop]) throw new Error(`Message object is missing translation for '${la.tag}'`)
            }

        }

        //translate the message
        const prop = lprop(langTag);
        
        if (Message[prop]) return Message[prop];
        
        if (fallback) {
            const fprop = lprop(fallback);
            if (Message[fprop]) return maybeFlagged(Message[fprop]);
        }

        if (anyFallback) {
            return maybeFlagged(Message[Object.keys(Message)[0]]);
        }
        
        if (silent) return '';

        return message?message.replace('${langTag}',langTag):`(no translation)`;

    }

    function maybeFlagged(text) {
        if (flagMissing) return `[¿«${text}»?]`;
        else return text;
    }
}



function lprop(tag) {
    let prop = stripTo(tag, alphabet + numerals);

    while (prop && isNumeric(prop[0])) prop = prop.slice(1,prop.length);
    
    return prop;
}