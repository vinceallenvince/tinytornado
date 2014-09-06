var test = require('tape'),
    Spine, obj;

test('load Spine.', function(t) {
  Spine = require('../src/spine.js');
  t.ok(Spine, 'object loaded');
  t.end();
});