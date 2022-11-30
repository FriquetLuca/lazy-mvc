const { LazyNetList } = require('lazy-toolbox');
const { dateLogMS } = require("@lazy-toolbox/portable");
console.log(dateLogMS("Network list:"));
const ipv4s = LazyNetList.IPv4();
for(let ipv4 of ipv4s) {
    console.log(dateLogMS(ipv4));
}