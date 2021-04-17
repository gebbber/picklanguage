# pickLanguage - Parse and Pick Language Header

## Quick Start: as Express Middleware:
```javascript
const express = require('express');
const picklanguage = require('picklanguage')({strict: true});

const app = express();

app.use(picklanguage(['en', 'fr-CA'])); // implemented languages

app.get(`/`, (req, res)=>{

    const HelloFriend = {en: `Hello, my friend!`, frCA: `Bonjour, mon ami!`};

    res.send(res.translate(HelloFriend));

});

app.listen(3000);
```

Import `picklanguage` and then `app.use` it before any routes that need it, and it will add the `translate(MessageObject)` to the `response` object for convenient use in other middleware functions.

As a fallback, it chooses a language based on the `accept-language` header sent by the user agent, but users on unfamiliar computers don't always have control over the browser language setting, and so it's preferable to allow them to select the display language.

`picklanguage` looks for a preferred display language in any of the following places, before falling back to the language header: `req.session.user.language`, `req.session.user.lang`, `req.session.language`, `req.session.lang`, `req.user.language`, `req.user.lang`, `req.language`, `req.lang`

This means if you store the user's preferred language (as an individual BCP 47 language, or a series of tags formatted like a language header), then `picklanguage` will pick it up as long as you `app.use` it *after* your session middleware.

An `options` object with either `strict: true` or `strict: false` must be passed to `picklanguage` before it can be used&mdash;shown above in-line with the `require` function.  'Strict' mode actively looks for message objects with missing translations, and throws an error (only once an attempt is made to translate them).

## More Generic Use

`picklanguage` returns a function, and each time up to three arguments can be passed, in any order:

### `picklanguage(availableLanguages, options, userLanguagePref)`

* `options` is an options object; `strict:true` or `strict:false` is mandatory; other options are shown below
* `availableLanguages` is an array of implemented language tags; tags must be BCP-47 compliant
* `userLanguagePref` is the user's preferred language (BCP-47-compliant language tag), or multiple languages formatted as an `accept-language` request header string

You must pass both `availableLanguages` and an `options` object having either `strict: true` or `strict: false`, either before or with the string providing the user's language preference.  This can be done in subsequent calls to picktranslate, or in one line:

```javascript
const { translate } = require('picklanguage') ({strict: true}) (['en','fr-CA']) ('en');

console.log(translate(HelloFriend));
```
or:
```javascript
const { translate } = require('picklanguage')({strict: true}, ['en','fr-CA'], 'en');

console.log(translate(HelloFriend));
```
or:
```javascript
let picklanguage = require('picklanguage');

picklanguage = picklanguage({strict: true}); // mandatory option
picklanguage = picklanguage(['en', 'en-US', 'en-CA']); // implemented all three!
picklanguage = picklanguage({silent: true}); // add more options

//translator function for generic english, and chosen language tag:
const { translate, langTag } = picklanguage('en'); 

console.log('Display language:', langTag);
console.log(translate(HelloFriend));
```

## Options

### `strict` *(mandatory `true` or `false`)*

Setting `strict: true` will cause `picklanguage` to throw an error if any object is ever translated which doesn't have all supported langauges.  Useful for *development* environments to ensure translations have not been missed.  Set it to `false` for more graceful behavior in production.  (Falsey values won't work&mdash; the value must be "strictly" `true` or `false`.)

A sensible value for the `strict:` setting might be:
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
    message: 'MISSING: ${tagName}' //not a template literal!
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

Places `[¿«funny characters»?]` when any fallback is used:

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

## Front-End Use - React

### For a much simpler and more elegant solution in React, see <a href="https://www.npmjs.com/package/usetranslate">NPM: usetranslate</a>

Use `useContext` or `props` to pass user language to the components that need it, and then:

```jsx
import React from 'react';

const picklanguage = require('picklanguage')({strict: true});

export default function App() {
    
    [languagePref, setLanguagePref] = React.useState('en-CA');

    // Get user's language preference from UI dropdown or fetch language header
    // from server, then setLanguagePref(languageHeader)

    const languages = ['en-CA','fr-CA'];
    const { translate } = pickLanguage(languagePref, languages);   

    return <SpecialWarning translate={translate} />;

}

const Ok      = {enCA: "OK", frCA: "OK"};
const Cancel  = {enCA: "Cancel", frCA: "Annuler"};
const Message = {enCA: "Don't do that!", frCA: "Ne fait pas ca!"};

function SpecialWarning(props) {

    const translate = props.translate;

    return (
        <PopUpWindow>
            <p>{translate(Message)}</p>
            <Button>{translate(Ok)}</Button>
            <Button>{translate(Cancel)}</Button>
        </PopUpWindow>
    );
}
```

