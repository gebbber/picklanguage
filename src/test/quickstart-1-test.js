const pickLanguage = require('../index');

const {langTag} = pickLanguage(['en', 'fr-CA'], 'zh,de;q=0.8,fr;');

console.log(langTag);

/*

'fr-CA'

*/