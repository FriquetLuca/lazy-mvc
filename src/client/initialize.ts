import { LazyAnimate, LazyTheme, LazyDoc } from '@lazy-toolbox/client';
LazyAnimate.loadDefault();
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