var formatter = require('..');
var likefood = formatter('I like {{ 0 }}, {{ 0 }} is excellent and kicks the pants off {{ 1 }}.');
var partial;

// get a partial 
console.log(partial = likefood('bacon'));
// <-- [Function]

// pass the remaining argument it's waiting for
console.log(partial('bread'));
// <-- I like bacon, bacon is excellent and kicks the pants off bread.