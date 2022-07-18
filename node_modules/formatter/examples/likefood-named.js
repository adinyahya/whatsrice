var formatter = require('..');
var likefood = formatter('I like {{ great }}, {{ great }} is excellent and kicks the pants off {{ poor }}.');

console.log(likefood({ great: 'bacon', poor: 'bread' }));
// <-- I like bacon, bacon is excellent and kicks the pants off bread.