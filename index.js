function pickLanguage(langHeader, choices) {
    
    let lh = langHeader;
    
    while (lh.includes(' ')) lh = lh.replace(' ','');

    let userLanguages = lh.split(',')
    .map(lang => ({
        lang: lang.split(';q=')[0], 
        q: Number(lang.split(';q=')[1]) || 1 
    }))
    .sort((a,b) => (b.q - a.q))
    .map(lang =>
        lang.lang.split('-')[0].toLowerCase()
        +(lang.lang.includes('-') ? lang.lang.split('-')[1].toUpperCase() : '')
    );
    console.log({userLanguages:userLanguages})

    let available = choices.map(lang => lang.split('-')[0].toLowerCase()
    + (lang.includes('-') ? lang.split('-')[1].toUpperCase() : ''));
    console.log({available:available});
    //Everything changed from 'aa-AA' to 'aaAA'

    //Look for an exact language/variant match
    let chosenOne = "";
    for (let i=0; i<userLanguages.length; i++) {
        if (!chosenOne && available.includes(userLanguages[i])) chosenOne = userLanguages[i];
    }
    
    if (chosenOne) return chosenOne; // found an exact match

    //look for a language-only match:
    userLanguages = userLanguages.map(language=>{
        let newL = "";
        for (let i=0; i<language.length; i++) {
            if (language[i] === language[i].toLowerCase()) newL += language[i];
        }
        return newL;
    })
    strippedAvailable = available.map(language=>{
        let newL = "";
        for (let i=0; i<language.length; i++) {
            if (language[i] === language[i].toLowerCase()) newL += language[i];
        }
        return newL;
    })

    for (let i=0; i<userLanguages.length; i++) {
        if (!chosenOne && strippedAvailable.includes(userLanguages[i])){
            chosenOne = available[strippedAvailable.indexOf(userLanguages[i])];
        }
        
    }
    
    if (chosenOne) return chosenOne;
    else return available[0];

}


module.exports = (arg1, arg2) => {

    if (arg2) return pickLanguage(arg1, arg2);
    
    return (req, res, next) => {
        const langHeader = req.headers["accept-language"];
        req.lang = pickLanguage(langHeader, arg1);
        next();
    };
    
};


