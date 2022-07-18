var test = require('tape');
var formatter = require('..');

test('process a length modifier (numeric args)', function(t) {
  var line;

  t.plan(2);
  t.ok(line = formatter('{{ 0|len:10 }}'), 'created formatter');
  t.equal(line('test'), 'test      ');
});

test('process a length modifier (numeric args, custom padding charater)', function(t) {
  var line;

  t.plan(2);
  t.ok(line = formatter('{{ 0|len:10:a }}'), 'created formatter');
  t.equal(line('test'), 'testaaaaaa');
});

test('process a length modifier (named args)', function(t) {
  var line;

  t.plan(2);
  t.ok(line = formatter('{{ name|len:10 }}'), 'created formatter');
  t.equal(line({ name: 'Ted' }), 'Ted       ');
});

test('process a length modifier (named args, custom padding charater)', function(t) {
  var line;

  t.plan(2);
  t.ok(line = formatter('{{ name|len:10:a }}'), 'created formatter');
  t.equal(line({ name: 'Ted' }), 'Tedaaaaaaa');
});

test('pad numeric ladding to the left of the original value', function(t) {
  var line;

  t.plan(2);
  t.ok(line = formatter('{{ value|len:10:0 }}'), 'created formatter');
  t.equal(line({ value: 500 }), '0000000500');
});