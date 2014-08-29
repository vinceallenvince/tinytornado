var test = require('tape'),
    Context,
    Tornado, obj;

test('load Tornado.', function(t) {
  t.throws(function() {
    Tornado = require('../src/tornado.js');
  }, 'throws error from Soundbed.');
  //t.ok(Tornado, 'object loaded');
  t.end();
});