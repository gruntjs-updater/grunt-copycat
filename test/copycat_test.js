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


//I started writing a function to recursively compare directory contents
//but then I realized I shouldn't be writing code that needs to be tested
//in a test suite.

//So, a simple list of comparisons it is.
var fileCompares = [
  "one/emptyindir2.css",
  "one/alsoindir2.css",
  "two/battery.js",
  "three/corpulent.css",
  "four/inboth.css",
  "emptyindir1.css",
  "inall3.html",
  "inall3.css"
];

var expectedPrefix = "test/expected/";
var actualPrefix = "tmp/";

exports.copycat = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  copy: function(test) {
    test.expect(8);

    var actual, expected;

    var thisStr = "copy/";

    fileCompares.forEach(function(str) {

      actual = grunt.file.read(actualPrefix + thisStr + str);
      expected = grunt.file.read(expectedPrefix + thisStr + str);

      test.equal(actual, expected, "Full copy, override by later directories, file: " + str);
    });

    test.done();
  },
  cat: function(test) {
    test.expect(8);

    var thisStr = "cat/";

    var actual, expected;
    fileCompares.forEach(function(str) {

      actual = grunt.file.read(actualPrefix + thisStr + str);
      expected = grunt.file.read(expectedPrefix + thisStr + str);

      test.equal(actual, expected, "Full concatenate, collisions are merged with later directories's file contents appearing later." + str);
    });

    test.done();
  },



  copyandcat : function(test){
    test.expect(8);

    var thisStr = "copyandcat/";

    var actual, expected;
    fileCompares.forEach(function(str) {

      actual = grunt.file.read(actualPrefix + thisStr + str);
      expected = grunt.file.read(expectedPrefix + thisStr + str);

      test.equal(actual, expected, "Copy should override as above except for .css files, which are concatenated as above." + str);
    });

    test.done();
  },

  //This test is here because of a foolhardy attempt to detect collisions based on whether the file existed in the destination or not.
  donetwice : function(test) {
    test.expect(8);

    var thisStr = "donetwice/";

    var actual, expected;
    fileCompares.forEach(function(str) {

      actual = grunt.file.read(actualPrefix + thisStr + str);
      expected = grunt.file.read(expectedPrefix + thisStr + str);

      test.equal(actual, expected, "Running this task multiple times should not result in different behavior." + str);
    });

    test.done();
  }


  
};
