const pick = require('../pick');

test('pick chooses the only available language',()=>{
    const avail = [`ab`];
    const pref = `ab`;
    expect(pick(avail, pref)).toBe(`ab`);
});

test('pick chooses the single preferred language of several options ',()=>{
    const avail = [`ab`, `cd`];
    const pref = `ab`;
    expect(pick(avail, pref)).toBe(`ab`);
});

test('pick chooses the single preferred language of several options, in a middle position',()=>{
    const avail = [`cd`, `ab`, `ef`];
    const pref = `ab`;
    expect(pick(avail, pref)).toBe(`ab`);
});

test('pick chooses the single preferred language of several options, in an end position',()=>{
    const avail = [`cd`, `ef`, `ab`];
    const pref = `ab`;
    expect(pick(avail, pref)).toBe(`ab`);
});

test('pick chooses a preferred language given several preferences',()=>{
    const avail = [`cd`, `ef`, `ab`];
    const pref = `ab, cd;q=0.8`;
    expect(pick(avail, pref)).toBe(`ab`);
});

test('pick chooses a preferred language given several preferences, in a middle position',()=>{
    const avail = [`cd`, `ef`, `ab`];
    const pref = `cd;q=0.8, ab, ef;q=0.6 `;
    expect(pick(avail, pref)).toBe(`ab`);
});

test('pick chooses a preferred language given several preferences, in an end position',()=>{
    const avail = [`cd`, `ef`, `ab`];
    const pref = `cd;q=0.8 , ef;q=0.6 , ab `;
    expect(pick(avail, pref)).toBe(`ab`);
});

test('pick gives free reign to a wild card',()=>{
    const avail = [`cd`, `ef`, `ab`];
    const pref = `gh, *;q=0.1`;
    expect(pick(avail, pref)).not.toBe(`gh`); //probably 'cd' but could really be any
});




//regional variations
test('pick prefers a matching no regional variation',()=>{
    const avail = [`cd-EF`, `cd`];
    const pref = `cd`;
    expect(pick(avail, pref)).toBe(`cd`);
});

test('pick prefers a matching a specified regional variation',()=>{
    const avail = [`cd-EF`, `cd`];
    const pref = `cd-EF`;
    expect(pick(avail, pref)).toBe(`cd-EF`);
});

test('pick is willing to pick up a regional variation',()=>{
    const avail = [`cd-EF`, `cd-GH`];
    const pref = `cd`;
    expect(pick(avail, pref)).toBe(`cd-EF`);
});

test('pick is willing to drop a regional variation',()=>{
    const avail = [`cd`, `ef-GH`];
    const pref = `cd-GH`;
    expect(pick(avail, pref)).toBe(`cd`);
});

test('pick prefers an 87% exact match to missing or added a regional variant (86% match)',()=>{
    const avail = [`cd`, `ef-GH`];
    const pref = `cd-GH , ef-GH;q=0.87`;
    expect(pick(avail, pref)).toBe(`ef-GH`);
});

test('pick prefers an a missing or added regional variant (86% match) over a 85% exact match',()=>{
    const avail = [`cd`, `ef-GH`];
    const pref = `cd-GH , ef-GH;q=0.85`;
    expect(pick(avail, pref)).toBe(`cd`);
});

test('pick prefers a more specific match (no regional variation)',()=>{
    const avail = [`cd`, `cd-EF`];
    const pref = `cd`;
    expect(pick(avail, pref)).toBe(`cd`);
});

test('pick prefers a more specific match (with regional variation)',()=>{
    const avail = [`cd`, `cd-EF`];
    const pref = `cd-EF`;
    expect(pick(avail, pref)).toBe(`cd-EF`);
});


test('pick picks a language if there is no match',()=>{
    const avail = [`cd`, `cd-EF`];
    const pref = `gh`;
    expect(pick(avail, pref)).toBe(`cd`);
});


test('pick picks a language if there is no specified preference',()=>{
    const avail = [`cd`, `cd-EF`];
    const pref = ``;
    expect(pick(avail, pref)).toBe(`cd`);
});


test('pick throws an error if the preference is not a string',()=>{
    const avail = [`cd`, `cd-EF`];
    const pref = false;
    expect(()=>pick(avail, pref)).toThrow(`Expecting a string`);
});





//script variations
test('pick prefers matching a lack of specified script',()=>{
    const avail = [`cd-EFGH`, `cd`];
    const pref = `cd`;
    expect(pick(avail, pref)).toBe(`cd`);
});

test('pick prefers a matching a specified script',()=>{
    const avail = [`cd-EFGH`, `cd`];
    const pref = `cd-EFGH`;
    expect(pick(avail, pref)).toBe(`cd-EFGH`);
});

test('pick is willing to pick up an uknown script if necessary',()=>{
    const avail = [`cd-EFGH`, `cd-GHIJ`];
    const pref = `cd`;
    expect(pick(avail, pref)).toBe(`cd-EFGH`);
});

test('pick is willing to drop a specified script if necessary',()=>{
    const avail = [`cd`, `ef-GHIJ`];
    const pref = `cd-GHIJ`;
    expect(pick(avail, pref)).toBe(`cd`);
});

test('pick prefers a 72% exact match to missing or added a script (71% match)',()=>{
    const avail = [`cd`, `ef-GHIJ`];
    const pref = `cd-GHIJ , ef-GHIJ;q=0.72`;
    expect(pick(avail, pref)).toBe(`ef-GHIJ`);
});

test('pick prefers a missing or added script (71% match) over a 70% exact match',()=>{
    const avail = [`cd`, `ef-GHIJ`];
    const pref = `cd-GHIJ , ef-GHIJ;q=0.7`;
    expect(pick(avail, pref)).toBe(`cd`);
});

test('pick prefers a more specific match (no script)',()=>{
    const avail = [`cd`, `cd-EFgh`];
    const pref = `cd`;
    expect(pick(avail, pref)).toBe(`cd`);
});

test('pick prefers a more specific match (with script)',()=>{
    const avail = [`cd`, `cd-EFGH`];
    const pref = `cd-EFGH`;
    expect(pick(avail, pref)).toBe(`cd-EFGH`);
});

test('pick prefers to pick up a regional variant rather than a missing or added script',()=>{
    const avail = [`cd-hijk`, `cd-ef`];
    const pref = `cd`;
    expect(pick(avail, pref)).toBe(`cd-ef`);
});


test('pick prefers to pick up a regional variant with 86% rather than a missing or added script',()=>{
    const avail = [`cd-hijk`, `cd-ef`];
    const pref = `cd`;
    expect(pick(avail, pref)).toBe(`cd-ef`);
});

test(`doesn't act like NPM 'accept-language'`, ()=>{
    const avail = ['en', 'fr-CA'];
    const pref = 'fr';
    expect(pick(avail, pref)).toBe(`fr-CA`);
})

