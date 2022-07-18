var test = require('tape');
var formatter = require('..');

test('replace named expressions (spaceless expression)', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('Hi there {{name}}!'), 'created formatter');
  t.equal(msg({ name: 'Bob' }), 'Hi there Bob!');
});

test('replace named expressions (with spaces in the expression)', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('Hi there {{ name }}!'), 'created formatter');
  t.equal(msg({ name: 'Bob' }), 'Hi there Bob!');
});

test('replace multiple instances of a variable', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('I like {{ like }}, {{ like }} tastes great!'), 'created formatter');
  t.equal(msg({ like: 'bacon' }), 'I like bacon, bacon tastes great!');
});

test('replace multiple argument values', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('I like {{ best }}, it is way better than {{ ok }}...'), 'created formatter');
  t.equal(msg({ best: 'bacon', ok: 'ham' }), 'I like bacon, it is way better than ham...');
});

test('remove unresolved placeholders', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('Hi there {{ name}}!'), 'created formatter');
  t.equal(msg(), 'Hi there !');
});