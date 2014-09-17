var test = require('tape'),
    Runner, obj;

test('load Runner.', function(t) {
  Runner = require('../src/runner.js');
  t.ok(Runner, 'object loaded');
  t.end();
});