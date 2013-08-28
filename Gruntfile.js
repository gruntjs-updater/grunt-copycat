/*
 * grunt-copycat
 * 
 *
 * Copyright (c) 2013 Globus Online
 * Author Jim Kogler
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    copycat: {
      copy: {
        dirs : ["test/fixtures/dir1", "test/fixtures/dir2", "test/fixtures/dir3"],
        dest : "tmp/copy/",
        options : {
          merge : function() {return false;}
        }
      },
      cat : {
        dirs : ["test/fixtures/dir1", "test/fixtures/dir2", "test/fixtures/dir3"],
        dest: "tmp/cat/",
        options : {
          merge : function() {return true;}
        }
      },
      copyandcat : {
        dirs : ["test/fixtures/dir1", "test/fixtures/dir2", "test/fixtures/dir3"],
        dest : "tmp/copyandcat/",
        options: {
          merge : function(file) {
            if(file.split(".").pop()==="css") {
              return true;
            }
            return false;
          }
        }
      },
      donetwice1 : {
        dirs : ["test/fixtures/dir1", "test/fixtures/dir2", "test/fixtures/dir3"],
        dest : "tmp/donetwice/",
        options : {
          merge : function(file) {
            if(file.split(".").pop()==="css") {
              return true;
            }
            return false;
          }
        }
      },
      donetwice2 : {
        dirs : ["test/fixtures/dir1", "test/fixtures/dir2", "test/fixtures/dir3"],
        dest : "tmp/donetwice/",
        options : {
          merge : function(file) {
            if(file.split(".").pop()==="css") {
              return true;
            }
            return false;
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  //Load tasks
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'copycat', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
