var test = require('tape');
var formatter = require('..');

test('parse an empty formatter string', function(t) {
  var empty;

  t.plan(3);

  t.ok(empty = formatter(''), 'formatter executed');
  t.equal(empty(), '');
  t.equal(empty('hi'), '');
});

test('parse a formatter with no arguments', function(t) {
  var empty;

  t.plan(3);

  t.ok(empty = formatter(), 'formatter executed');
  t.equal(empty(), '');
  t.equal(empty('hi'), '');
});