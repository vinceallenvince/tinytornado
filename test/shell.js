var test = require('tape'),
    Shell, obj;

test('load Shell.', function(t) {
  Shell = require('../src/shell.js');
  t.ok(Shell, 'object loaded');
  t.end();
});