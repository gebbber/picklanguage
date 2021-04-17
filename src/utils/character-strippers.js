function stripTo(input, characterSet) {
    if (typeof input !== 'string') throw new Error('Input must be a string');
    if (typeof characterSet !== 'string') throw new Error('Character set must be a string');
    let a ="";
    for (let i=0; i<input.length; i++) {
        if (characterSet.includes(input[i])) a += input[i];
    }
    return a;
}

const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const numerals='0123456789';
function alpha(input) {return stripTo(input, alphabet);}
function numeric(input) {return stripTo(input, numerals);}
function isNumeric(input) {return (input === numeric(input));}
function isAlpha(input) {return (input === alpha(input));}

module.exports = {
    stripTo: stripTo,
    alphabet: alphabet,
    numerals: numerals,
    alpha: alpha,
    numeric: numeric,
    isAlpha: isAlpha,
    isNumeric: isNumeric
}