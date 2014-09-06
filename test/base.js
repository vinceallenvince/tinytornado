var test = require('tape'),
    Base, obj;

test('load Base.', function(t) {
  Base = require('../src/base.js');
  t.ok(Base, 'object loaded');
  t.end();
});