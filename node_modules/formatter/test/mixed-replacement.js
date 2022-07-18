var test = require('tape');
var formatter = require('..');

test('replace a mixed expression', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('Hi there {{name}}, welcome to {{ 0 }}!'), 'created formatter');
  t.equal(msg('Australia', { name: 'Bob' }), 'Hi there Bob, welcome to Australia!');
});