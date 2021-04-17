const pick = require('./pick');
const translator = require('./translator');

module.exports = (arg1, arg2, arg3) => {
    return pickLanguage(arg1, arg2, arg3, {});
};

//internal use only:
function pickLanguage(arg1, arg2, arg3, collected) {
    const options = anObjectFrom(arg1, arg2, arg3, { withProperty: 'strict' });
    const langPref = aStringFrom(arg1, arg2, arg3);
    const available = anArrayFrom(arg1, arg2, arg3);

    const collection = collected || {};
    if (options) collection.options = collection.options ? { ...collection.options, ...options } : options;
    if (available) collection.available = available;

    // if we've collected a language preference string, then return the chosen language and a translator
    if (langPref) {

        if (!collection.options || (collection.options.strict !== false && collection.options.strict !== true))
            throw new Error('Must set options: {strict: true} or {strict: false}')

        if (!collection.available || collection.available.length === 0)
            throw new Error('No available languages specified');

        const langTag = pick(collection.available, langPref);

        return {
            langTag: langTag,
            translate: translator(langTag, collection.available, collection.options)
        };

    }

    //if we have an Express middleware signature, then act as middleware
    const { req, res, next } = isMiddleware(arg1, arg2, arg3);
    if (req && res && next) {

        if (!collection.options || (collection.options.strict !== false && collection.options.strict !== true))
            throw new Error('Must set options: {strict: true} or {strict: false}');
        const strict = collection.options.strict;

        if (!collection.available || collection.available.length === 0)
            throw new Error('No available languages specified');
        
        const reqLangPref = (
            (req.session && req.session.user && (req.session.user.language || req.session.user.lang))
            || (req.session && (req.session.language || req.session.lang))
            || (req.user && (req.user.language || req.user.lang))
            || req.language
            || req.lang
            || (req.headers && req.headers["accept-language"])
        )

        const langTag = pick(collection.available, reqLangPref);

        res.langTag = langTag;
        res.translate = translator(langTag, collection.available, collection.options);

        next();

    }

    return (arg1, arg2, arg3) => {
        return pickLanguage(arg1, arg2, arg3, collection);
    };

}

function aStringFrom(arg1, arg2, arg3) {
    if (arg1 && typeof arg1 === 'string') return arg1;
    else if (arg2 && typeof arg2 === 'string') return arg2;
    else if (arg3 && typeof arg3 === 'string') return arg3;
    else return null;
}

function anArrayFrom(arg1, arg2, arg3) {
    if (arg1 && Array.isArray(arg1)) return arg1;
    if (arg2 && Array.isArray(arg2)) return arg2;
    if (arg3 && Array.isArray(arg3)) return arg3;
    return null;
}

function anObjectFrom(arg1, arg2, arg3, obj) {
    const needs = (obj && obj.with && typeof obj.withProperty === 'string') || false;
    if (arg1 && typeof arg1 === 'object' && !Array.isArray(arg1) && arg1 !== null && (!needs || arg1[needs])) return arg1;
    if (arg2 && typeof arg2 === 'object' && !Array.isArray(arg2) && arg2 !== null && (!needs || arg2[needs])) return arg2;
    if (arg3 && typeof arg3 === 'object' && !Array.isArray(arg3) && arg3 !== null && (!needs || arg3[needs])) return arg3;
    return null;
}

function isMiddleware(arg1, arg2, arg3) {
    if (
        arg1 && arg1.app && arg1.method && arg1.protocol
        && arg2 && arg2.app && arg2.send && arg2.end && arg2.set
        && arg3 && typeof arg3 === 'function'
    ) return { req: arg1, res: arg2, next: arg3 };
    else return { req: null, res: null, next: null };
}