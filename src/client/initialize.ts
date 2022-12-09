import { LazyAnimate, LazyTheme, LazyDoc, LazyTabularTextArea } from '@lazy-toolbox/client';
import { LazyParsing, LazyRule } from '@lazy-toolbox/portable';
LazyAnimate.loadDefault();
// Inject the tabulation into all textarea present in the HTML.
const loadTxtAreaDf = () => {
    const allTxtArea = document.querySelectorAll('textarea');
    for(let area of allTxtArea) {
        new LazyTabularTextArea(area);
    }
}
loadTxtAreaDf();

const makeTheme = new LazyTheme([
    'light',
    'dark'
], [ '.theme' ]);
const toggleTheme = () => {
    makeTheme.setNextTheme();
};
makeTheme.setTheme();
toggleTheme();
const myDiv = LazyDoc.newTag('div', {
    class: ['theme', makeTheme.theme() ],
    innerHTML: "<h1>This is a newly made content.</h1>",
    childs: [
        LazyDoc.newTag('p', { innerHTML: "Hello <span>world</span>!" })
    ]
});
document.body.appendChild(myDiv);

const contentToParse = "A 1st content string to parse ffs";
const ruleSet = LazyParsing.createSet(
    LazyRule.number(),
    LazyRule.word()
);
const parsedResult = LazyParsing.parse(contentToParse, ruleSet);
console.log(LazyParsing.toString(parsedResult, true));
