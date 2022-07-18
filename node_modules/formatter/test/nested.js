var test = require('tape');
var formatter = require('..');
var testData = {
  name: 'Bob',
  
  address: {
    street: {
      number: 15,
      name: 'West St'
    },
    
    country: 'Australia'
  }
};

test('extract simple values from compound data', function(t) {
  var message;

  t.plan(2);
  t.ok(message = formatter('Hi there {{ name }}!'), 'formatter created');
  t.equal(message(testData), 'Hi there Bob!');
});

test('extract a value 2 levels deep', function(t) {
  var message;

  t.plan(2);
  t.ok(
    message = formatter('Hi there {{ name }} from {{ address.country }}!'),
    'formatter created'
  );

  t.equal(message(testData), 'Hi there Bob from Australia!');
});

test('extract a value 3 levels deep', function(t) {
  var message;

  t.plan(2);
  t.ok(
    message = formatter('{{ name }} lives on a street named {{ address.street.name }}'),
    'formatter created'
  );

  t.equal(message(testData), 'Bob lives on a street named West St');
});