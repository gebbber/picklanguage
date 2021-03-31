# pickLanguage - Parse and Pick Language Header

Parses the `accept-language` HTTP request header, and picks the user's preferred language from an available list.

Forces language characters to lower case and variant characters to uppercase, and removes the hyphen, so that the returned value can be used as object keys.

## Back-End Use - Parsing a Header and Choosing a Language
Back end: add server middleware early on in the request stack
```javascript
const pickLanguage = require('picklanguage');

//add language choice to request object:

const available = ['en-CA', 'fr-CA'];
app.use(pickLanguage(available));

// ...and make use of it like this:
const HELLO = {
    enCA: 'Hello! Welcome to this app.',
    frCA: 'Bonjour! Bienvenue a ce app!'
};

app.get('/', (req, res)=>{
    res.send(HELLO[req.lang]);
})
```
The module's export returns an Express-compatible middleware function if it's called with only one argument.  That argument must be an array of available languages.

It will retrieve and parse the user's language header, reorder it in the user's order of preference based on specified `q=` factor, and then return the first language/variant combination that matches, in order of the user's preference.

If no exact match of language/variant is found, it will strip the variant portion from the arrays, and return the first preferred match of just the language.  The associated language/variant combination provided in the available-languages array is returned, not just the language.

If no language match is found, it will return the first language in the available-languages array (element `[0]`).  It will therefore always return one element of the array passed in of available languages.

In all cases, it removes the hyphen if a language variant is returned, so it returns `'enCA'` instead of `'en-CA'`, making it easier to assemble a JavaScript object of messages in available languages.

## Front-End Use - React

Use `useContext` or `props` to pass user language to elements that need it, and then:

```jsx
import React from 'react';


export default function App() {
    
    [languagePref, setLanguagePref] = React.useState('en-CA');

    //Fetch from /languageHeader, then setLanguagePref(languageHeader)

    const languages = ['en-CA','fr-CA'];
    const lang = pickLanguage(languagePref, languages);   

    return <SpecialWarning lang={lang} />;

}

const OK      = {enCA: "OK", frCA: "OK"};
const CANCEL  = {enCA: "Cancel", frCA: "Annuler"};
const MESSAGE = {enCA: "Don't do that!", frCA: "Ne fait pas ca!"};

function SpecialWarning(props) {
    return (
        <PopUpWindow>
            <p>{MESSAGE(props.lang)}</p>
            <Button>{OK(props.lang)}</Button>
            <Button>{CANCEL(props.lang)}</Button>
        </PopUpWindow>
    );
}
```

