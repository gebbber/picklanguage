const express = require('express');
let picklanguage = require('../')({strict: true});
picklanguage = picklanguage({silent: true});
picklanguage = picklanguage({message: 'hi'});

const app = express();


app.use('/:lang', (req, res, next)=>{
    if (req.params.lang) req.lang = req.params.lang;
    next();
})
app.use(picklanguage(['en', 'fr-CA'])); // implemented languages

app.use(`/`, (req, res)=>{

    const HelloFriend = {en: `Hello, my friend!`, frCA: `Bonjour, mon ami!`};

    res.send(req.lang + ' ' + res.translate(HelloFriend));

});

app.listen(3000);