var test = require('tape');
var formatter = require('..');
var message = 'I like {{ 0 }}, it is way better than {{ 1 }}...';
var expectedOutput = 'I like bacon, it is way better than ham...';
var msg;
var partial;

test('create the formatter', function(t) {
  t.plan(1);
  msg = formatter(message);

  t.ok(typeof msg == 'function', 'created formatter function');
});

test('replace multiple argument values', function(t) {
  t.plan(1);
  t.equal(msg('bacon', 'ham'), expectedOutput);
});

test('should return a partial when only one arg is supplied', function(t) {
  t.plan(1);
  partial = msg('bacon');
  t.ok(typeof partial == 'function', 'got partial function');
});

test('should be able to resolve the partial', function(t) {
  t.plan(1);
  t.equal(partial('ham'), expectedOutput);
});