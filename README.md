# pickLanguage - Parse and Pick Language Header

## Quick Start:
```javascript
const pickLanguage = require('picklanguage');

const {langTag} = pickLanguage(['en', 'fr-CA'], 'zh,de;q=0.8,fr;');

console.log(langTag);

/*

'fr-CA'

*/
```

## Quick Start&mdash;as Express Middleware:
```javascript
const express = require('express');
const pickLanguage = require('picklanguage');

const app = express();

    app.use(pickLanguage(['en', 'fr-CA'])); // implemented languages

    const HelloMessage = {en: `Hello, my friend!`, frCA: `Bonjour, mon ami!`};

    app.get(`/`, (req, res)=>{
        res.send(res.translate(HelloMessage)); // 'Hello, ...' or 'Bonjour, ...'
    });

app.listen(3000);
```

Import the package and then `app.use` it before any routes that need to use it, telling it which languages have been implemented.  It will add the `res.translate` function for convenient use in other middleware functions.

If available, `pickLanguage` picks up the user's language preference from any of several places before falling back to parsing the `accept-language` header.

## API

### `pickLanguage(availableLanguages, options, userLanguagePref)`

* `options` is an options object; see below for available options
* `availableLanguages` is an array of language tags that you have implemented in your app (e.g., 'en', 'en-US', etc.)
* `userLanguagePref` is the user's preferred language and can be a single tag, or formatted as an `accept-language` request header
* These three arguments can be passed in any order.

### Picking a Language Directly

If passed a string, `pickLanguage` will assume it's a language tag or list of languages (formatted like an `accept-language` header), and will pick the best of the available languages, returning both the chosen tag and a function that can be used to translate message objects:

```javascript
const pickLanguage = require('picklanguage');

const {langTag, translate} = pickLanguage(['en', 'es'], 'en-US');

console.log(langTag);             // 'en'

console.log(translate(Message));  // English translation 
```

`pickLanguage` always returns one of the tags specified as implemented languages.  Specifying your implemented languages is mandatory.

### The `translate(Message)` Function

The `translate` function accepts an object, and returns the property on that object matching the user's preferred language.  The property name is selected as the chosen language tag, with any hyphens removed.  `'en-US'` will map to `enUS:`, `'fr'` will map to `fr:`, `'ES'` will map to `ES:`, etc.  Note that although language tags are case insensitive, the object properties used *are* case sensitive, and `pickLanguage` will use typecase as you provided in your implemented-languages array.  To illustrate:

```javascript
const pickLanguage = require('picklanguage')({strict: false});

const { translate } = pickLanguage(['en', 'fr-CA'], `EN-US`);

const GoodMessage = {en: "Hello", frCA: "Bonjour"};
const BrokenMessage = {EN: "Hello", frCA: "Bonjour"};

console.log(
    translate(GoodMessage),   // 'Hello'
    translate(BrokenMessage)  // '(no translation)'
);
```
Two things you can see here:
1. The object property chosen for translation matches the tag you passed as an implemented language.
2. The type case in the user's preferred language ('EN-US') is ignored, providing correct case-insensitive behavior for language tag interpretation.

By default, `translate` will throw an error if it ever attempts to translate a message object that is missing an implemented language, even if not attempting to translate to that language. To disable this, pass `{strict: false}` to `pickLanguage`.  (The `BrokenMessage` object in the example above would have thrown an error if `pickLanguage` had not been initialized with `{strict: false}`.)

Setting `{strict: false}` (or setting options in general) can be done in several places:

 ```javascript
const pickLanguage = require('picklanguage')({strict: false});

const { translate } = pickLanguage(['en', 'fr-CA']);
```
or:
```javascript
const pickLanguage = require('picklanguage');

const { translate } = pickLanguage(['en', 'fr-CA'], {strict: false}));
```
or: (notice the use of `let` in this next one)
```javascript
let pickLanguage = require('picklanguage');

pickLanguage = pickLanguage({strict: false, fallback: 'fr-CA'});

const { translate } = pickLanguage(['en', 'fr-CA']));
```

### Passing as Express Middleware

If passed to Express using `app.use`, `pickLanguage` will recognize that it's being used as middleware, and add `res.translate` and `res.langTag` to the response object.  It looks in several places for the user's preferred language, and then parses the 'accept-language' request header if no preference is found.

```javascript
const express = require('express');
const pickLanguage = require('picklanguage');

const app = express();

    app.use(pickLanguage(['en', 'fr-CA'])); // implemented languages

    app.get(`/`, (req, res)=>{

        const HelloFriend = {
            en: `Hello, my friend!`,
            frCA: `Bonjour, mon ami!`
        };

        res.send(res.translate(HelloFriend)); 
        // 'Hello, ...' or 'Bonjour, ...'

        console.log(res.langTag)
        // 'en' or 'fr-CA'

    });

app.listen(3000);
```

If you store the user's preferred language on the session or in their profile, then use `pickLanguage` after your session middleware, and `pickLanguage` can pick it up from any of the following, in this order: `req.session.user.language`, `req.session.user.lang`, `req.session.language`, `req.session.lang`, `req.user.language`, `req.user.lang`, `req.language`, `req.lang`.  Otherwise, you can add the user's language preference manually in any of these locations:

```javascript
app.use((req, res, next)=>{
    req.lang = 'en'; // add user's preferred language
    next();
});

app.use(pickLanguage(['en', 'fr-CA']));
```
(If you don't do this, `pickLanguage` will still fall back to picking it up from the accept-language header, providing for a very simple basic use case.)


## Options

### `strict` (defaults to `true`)

Setting `strict: true` will cause `pickLanguage` to throw an error you attempt to translate an object that is missing one of the languages you said you would support. Useful for development environments to ensure you have not missed any translations.  Set it to `false` for more graceful behavior in production. Falsey values won't work&mdash; the value must be "strictly" `false`.

A sensible value for the `strict:` setting in a node project might be:
```javascript
    const options = {
        strict: process.env.NODE_ENV === 'development'
    }
```

### `message`

Specifies a string to act as a stand-in for missing messages, when using `strict: false`.  Any value `"${tagName}"` in the string is replaced with the missing language tag:

```javascript
const options = {
    strict: false,
    message: 'MISSING: ${tagName}' //this is not a template literal
}
```
### `fallback`

Specifies a fallback language to be used, when using `strict: false` and a translation is missing:

```javascript
const options = {
    strict: false,
    fallback: 'en-US'
}
```

### `flagMissing`

Places `[¿«funny characters»?]` when a fallback is used:

```javascript
const options = {
    strict: false,
    fallback: 'en',
    flagMissing: true
}
```

### `silent`

Outputs an empty string when a translation is missing.  Default behavior is to output '(no translation)'.

```javascript
const options = {
    strict: false,
    silent: true
}
```

## Front-End Use in React

### See <a href="https://www.npmjs.com/package/usetranslate">NPM: usetranslate</a> for a React hook that uses this package for simple and elegant translation of messages in components.