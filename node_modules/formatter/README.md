# formatter

This is a simple library designed to do one thing and one thing only -
replace variables in strings with variable values.  It is built in such a
way that the formatter strings are parsed and you are provided with a
function than can efficiently be called to provide the custom output.


[![NPM](https://nodei.co/npm/formatter.png)](https://nodei.co/npm/formatter/)

[![Build Status](https://travis-ci.org/DamonOehlman/formatter.png?branch=master)](https://travis-ci.org/DamonOehlman/formatter)
[![stable](http://hughsk.github.io/stability-badges/dist/stable.svg)](http://github.com/hughsk/stability-badges)

[![browser support](https://ci.testling.com/DamonOehlman/formatter.png)](https://ci.testling.com/DamonOehlman/formatter)


## Example Usage

```js
var formatter = require('formatter');
var likefood = formatter('I like {{ 0 }}, {{ 0 }} is excellent and kicks the pants off {{ 1 }}.');

// I can then log out how much I like bacon
console.log(likefood('bacon', 'bread'));
// <-- I like bacon, bacon is excellent and kicks the pants off bread.
```

__NOTE__: Formatter is not designed to be a templating library and if
you are already using something like Handlebars or
[hogan](https://github.com/twitter/hogan.js) in your library or application
stack consider using them instead.

## Using named variables

In the examples above we saw how the formatter can be used to replace
function arguments in a formatter string.  We can also set up a formatter
to use particular key values from an input string instead if that is more
suitable:

```js
var formatter = require('formatter');
var likefood = formatter('I like {{ great }}, {{ great }} is excellent and kicks the pants off {{ poor }}.');

console.log(likefood({ great: 'bacon', poor: 'bread' }));
// <-- I like bacon, bacon is excellent and kicks the pants off bread.
```

## Nested Property Values

Since version `0.1.0` you can also access nested property values, as you
can with templates like handlebars.

## Partial Execution

Since version `0.3.x` formatter also supports partial execution when using
indexed arguments (e.g. `{{ 0 }}`, `{{ 1 }}`, etc).  For example:

```js
var formatter = require('formatter');
var likefood = formatter('I like {{ 0 }}, {{ 0 }} is excellent and kicks the pants off {{ 1 }}.');
var partial;

// get a partial 
console.log(partial = likefood('bacon'));
// <-- [Function]

// pass the remaining argument it's waiting for
console.log(partial('bread'));
// <-- I like bacon, bacon is excellent and kicks the pants off bread.
```

In the case above, the original formatter function returned by `formatter`
did not receive enough values to resolve all the required variables.  As
such it returned a function ready to accept the remaining values.

Once all values have been received the output will be generated.

## Performance

I've done some
[performance benchmarks](http://jsperf.com/formatter-performance) and
formatter is faster than handlebars, but that isn't surprising as it is far
simpler and doesn't have the smarts of HBS.  The test is really there to
ensure that I didn't do anything too silly...

Additionally, it should be noted that using formatter is 100% slower than
concatenating strings, so don't use it where performance is critical. 
Do use it where not repeating yourself is.

## Modifiers

### Length Modifier (len)

The length modifier is used to ensure that a string is exactly the length specified.  The string is sliced to the required max length, and then padded out with spaces (or a specified character) to meet the required length.

```js
// pad the string test to 10 characters
formatter('{{ 0|len:10 }}')('test');   // 'test      '

// pad the string test to 10 characters, using a as the padding character
formatter('{{ 0|len:10:a }}')('test'); // 'testaaaaaa'
```
