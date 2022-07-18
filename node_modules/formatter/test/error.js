var test = require('tape');
var formatter = require('..');
var message = 'Unable to run module: {{ name }}';

test('create an error formatter', function(t) {
  var helper;

  t.plan(2);
  t.ok(helper = formatter.error(message), 'executed formatter');
  t.ok(typeof helper == 'function', 'is a valid function');
});

test('pass through falsy values', function(t) {
  var helper;

  t.plan(2);
  t.ok(helper = formatter.error(message), 'executed formatter');
  t.notOk(helper(), 'helper returned false as expected');
});

test('mark up errors (removing unused variables)', function(t) {
  var helper;
  var error;

  t.plan(5);
  t.ok(helper = formatter.error(message), 'executed formatter');
  t.ok(error = helper(new Error()), 'generated error using helper');
  t.ok(error instanceof Error, 'generated error is still an Error instance');
  t.ok(error.message, 'have an error message');
  t.equal(error.message, 'Unable to run module: ');
});

test('mark up errors (expanding known variables)', function(t) {
  var helper;
  var error;

  t.plan(5);
  t.ok(helper = formatter.error(message), 'executed formatter');
  t.ok(error = helper(new Error(), { name: 'test' }), 'generated error using helper');
  t.ok(error instanceof Error, 'generated error is still an Error instance');
  t.ok(error.message, 'have an error message');
  t.equal(error.message, 'Unable to run module: test' );
});