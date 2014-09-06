var test = require('tape'),
    Vortex, obj;

test('load Vortex.', function(t) {
  Vortex = require('../src/vortex.js');
  t.ok(Vortex, 'object loaded');
  t.end();
});