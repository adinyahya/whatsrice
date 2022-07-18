/* jshint node: true */
'use strict';

var reVariable = /\{\{\s*([^\}]+?)\s*\}\}/;
var mods = require('./mods');

/**
  # formatter

  This is a simple library designed to do one thing and one thing only -
  replace variables in strings with variable values.  It is built in such a
  way that the formatter strings are parsed and you are provided with a
  function than can efficiently be called to provide the custom output.

  ## Example Usage

  <<< examples/likefood.js

  __NOTE__: Formatter is not designed to be a templating library and if
  you are already using something like Handlebars or
  [hogan](https://github.com/twitter/hogan.js) in your library or application
  stack consider using them instead.

  ## Using named variables

  In the examples above we saw how the formatter can be used to replace
  function arguments in a formatter string.  We can also set up a formatter
  to use particular key values from an input string instead if that is more
  suitable:

  <<< examples/likefood-named.js

  ## Nested Property Values

  Since version `0.1.0` you can also access nested property values, as you
  can with templates like handlebars.

  ## Partial Execution

  Since version `0.3.x` formatter also supports partial execution when using
  indexed arguments (e.g. `{{ 0 }}`, `{{ 1 }}`, etc).  For example:

  <<< examples/partial.js

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
**/

var formatter = module.exports = function(format, opts) {
  // extract the matches from the string
  var parts = [];
  var output = [];
  var chunk;
  var varname;
  var varParts;
  var match = reVariable.exec(format);
  var isNumeric;
  var outputIdx = 0;
  var ignoreNumeric = (opts || {}).ignoreNumeric;

  while (match) {
    // get the prematch chunk
    chunk = format.slice(0, match.index);
    
    // if we have a valid chunk, add it to the parts
    if (chunk) {
      output[outputIdx++] = chunk;
    }
    
    varParts = match[1].split(/\s*\|\s*/);
    match[1] = varParts[0];
    
    // extract the varname
    varname = parseInt(match[1], 10);
    isNumeric = !isNaN(varname);

    // if this is a numeric replacement expression, and we are ignoring
    // those expressions then pass it through to the output
    if (ignoreNumeric && isNumeric) {
      output[outputIdx++] = match[0];
    }
    // otherwise, handle normally
    else {
      // extract the expression and add it as a function
      parts[parts.length] = {
        idx: (outputIdx++),
        numeric: isNumeric,
        varname: isNumeric ? varname : match[1],
        modifiers: varParts.length > 1 ? createModifiers(varParts.slice(1)) : []
      };
    }

    // remove this matched chunk and replacer from the string
    format = format.slice(match.index + match[0].length);

    // check for the next match
    match = reVariable.exec(format);
  }
  
  // if we still have some of the format string remaining, add it to the list
  if (format) {
    output[outputIdx++] = format;
  }

  return collect(parts, output);
};

formatter.error = function(message) {
  // create the format
  var format = formatter(message);
  
  return function(err) {
    var output;
    
    // if no error has been supplied, then pass it straight through
    if (! err) {
      return;
    }

    output = new Error(
      format.apply(null, Array.prototype.slice.call(arguments, 1)));

    output._original = err;

    // return the new error
    return output;
  };
};

function collect(parts, resolved, indexShift) {
  // default optionals
  indexShift = indexShift || 0;

  return function() {
    var output = [].concat(resolved);
    var unresolved;
    var ii;
    var part;
    var partIdx;
    var propNames;
    var val;
    var numericResolved = [];

    // find the unresolved parts
    unresolved = parts.filter(function(part) {
      return typeof output[part.idx] == 'undefined';
    });

    // initialise the counter
    ii = unresolved.length;

    // iterate through the unresolved parts and attempt to resolve the value
    for (; ii--; ) {
      part = unresolved[ii];

      if (typeof part == 'object') {
        // if this is a numeric part, this is a simple index lookup
        if (part.numeric) {
          partIdx = part.varname - indexShift;
          if (arguments.length > partIdx) {
            output[part.idx] = arguments[partIdx];
            if (numericResolved.indexOf(part.varname) < 0) {
              numericResolved[numericResolved.length] = part.varname;
            }
          }
        }
        // otherwise, we are doing a recursive property search
        else if (arguments.length > 0) {
          propNames = (part.varname || '').split('.');

          // initialise the output from the last valid argument
          output[part.idx] = (arguments[arguments.length - 1] || {});
          while (output[part.idx] && propNames.length > 0) {
            val = output[part.idx][propNames.shift()];
            output[part.idx] = typeof val != 'undefined' ? val : '';
          }
        }

        // if the output was resolved, then apply the modifier
        if (typeof output[part.idx] != 'undefined' && part.modifiers) {
          output[part.idx] = applyModifiers(part.modifiers, output[part.idx]);
        }
      }
    }

    // reasses unresolved (only caring about numeric parts)
    unresolved = parts.filter(function(part) {
      return part.numeric && typeof output[part.idx] == 'undefined';
    });

    // if we have no unresolved parts, then return the value
    if (unresolved.length === 0) {
      return output.join('');
    }

    // otherwise, return the collect function again
    return collect(
      parts,
      output,
      indexShift + numericResolved.length
    );
  };
}

function applyModifiers(modifiers, value) {
  // if we have modifiers, then tweak the output
  for (var ii = 0, count = modifiers.length; ii < count; ii++) {
    value = modifiers[ii](value);
  }

  return value;
}

function createModifiers(modifierStrings) {
  var modifiers = [];
  var parts;
  var fn;
  
  for (var ii = 0, count = modifierStrings.length; ii < count; ii++) {
    parts = modifierStrings[ii].split(':');
    fn = mods[parts[0].toLowerCase()];
    
    if (fn) {
      modifiers[modifiers.length] = fn.apply(null, parts.slice(1));
    }
  }
  
  return modifiers;
}
