var test = require('tape');
var formatter = require('..');

test('replace numeric expressions with argument values', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('Hi there {{0}}!'), 'created formatter');
  t.equal(msg('Bob'), 'Hi there Bob!');
});

test('replace numeric expressions when the string contains spaces', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('Hi there {{ 0 }}!'), 'created formatter');
  t.equal(msg('Bob'), 'Hi there Bob!');
});

test('replace multiple instances of a variable', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('I like {{ 0 }}, {{ 0 }} tastes great!'), 'created formatter');
  t.equal(msg('bacon'), 'I like bacon, bacon tastes great!');
});

test('replace multiple argument values', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('I like {{ 0 }}, it is way better than {{ 1 }}...'), 'created formatter');
  t.equal(msg('bacon', 'ham'), 'I like bacon, it is way better than ham...');
});