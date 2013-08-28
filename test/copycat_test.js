'use strict';

var grunt = require('grunt');
var fs = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

//These tests are dependent on useful data to generate useful results.  

//The attached fixtures (dir1, dir2, dir3) provide:

//copy of a deep folder structure
//copy with a conflict where dir2 should take precedence
//
//concat of every file in a deep folder structure
//
//copy and concat where files for each are in both directories
//copy, concat of a file in all 3 directories
//

exports.copycat = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  copy: function(test) {
    test.expect(1);

    var actual = fs.readdirSync('tmp/copy').sort();
    var expected = fs.readdirSync('test/expected/copy').sort();
    test.deepEqual(expected, actual, 'Full copy, dir2 overrides dir1 where applicable.');

    test.done();
  },
  cat: function(test) {
    test.expect(1);

    var actual = fs.readdirSync('tmp/cat').sort();
    var expected = fs.readdirSync('test/expected/cat').sort();
    test.deepEqual(expected, actual, 'Full concatenate, collisions are merged with later directories\'s file contents appearing later.');

    test.done();
  },

  copyandcat : function(test){
    test.expect(1);

    var actual = fs.readdirSync('tmp/copyandcat').sort();
    var expected = fs.readdirSync('test/expected/copyandcat').sort();
    test.deepEqual(expected, actual, 'Copy should override as above except for .css files, which are concatenated as above.');

    test.done();
  },

  donetwice : function(test) {
    test.expect(1);

    var actual = fs.readdirSync('tmp/donetwice').sort();
    var expected = fs.readdirSync('test/expected/donetwice').sort();
    test.deepEqual(expected, actual, 'Running this task multiple times should not result in different behavior.');
    //This test is here because of a foolhardy attempt to detect collisions based on whether the file existed in the destination or not.

    test.done();
  }
};
