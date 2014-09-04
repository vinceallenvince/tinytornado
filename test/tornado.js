var test = require('tape'),
    TinyTornado, obj;

test('load TinyTornado.', function(t) {
  TinyTornado = require('../src/tinytornado.js');
  t.ok(TinyTornado, 'object loaded');
  t.end();
});