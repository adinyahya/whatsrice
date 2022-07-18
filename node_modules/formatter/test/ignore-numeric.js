var test = require('tape');
var formatter = require('..');

test('ignore numeric placeholders', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('Hi there {{ 0 }}!', { ignoreNumeric: true }), 'created formatter');
  t.equal(msg('Bob'), 'Hi there {{ 0 }}!');
});