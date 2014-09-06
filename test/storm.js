var test = require('tape'),
    Storm, obj;

test('load Storm.', function(t) {
  Storm = require('../src/storm.js');
  t.ok(Storm, 'object loaded');
  t.end();
});