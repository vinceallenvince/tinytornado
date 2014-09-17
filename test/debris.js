var test = require('tape'),
    Debris, obj;

test('load Debris.', function(t) {
  Debris = require('../src/debris.js');
  t.ok(Debris, 'object loaded');
  t.end();
});