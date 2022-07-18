var test = require('tape');
var formatter = require('..');

test('multiline replacement', function(t) {
  var msg;

  t.plan(2);
  t.ok(msg = formatter('Hi there.\nYour name is {{name}}!'), 'formatted created');
  t.equal(msg({ name: 'Bob' }), 'Hi there.\nYour name is Bob!');
});