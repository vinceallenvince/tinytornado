var test = require('tape'),
    Mask, obj;

test('load Mask.', function(t) {
  Mask = require('../src/mask.js');
  t.ok(Mask, 'object loaded');
  t.end();
});