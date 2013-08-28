/*
 * grunt-copycat
 * https://github.com/globusonline/grunt-copycat
 *
 * Copyright (c) 2013 Globus Online
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask("copycat", "A partially destructive, partially additive copy task.", function() {

    var dest;
    var buffer;
    var path = require("path");
    var tally = {
      merged : 0,
      dirs : 0,
      copied : 0
    };
    var writtenMap = {};

    var options = this.options();

    var shouldMerge = options.merge;

    var obj = {dest : this.data.dest, expand:true};

    var files = [];

    this.data.dirs.forEach(function(dir) {
      obj.cwd = dir;
      obj.src = "**";
      files = files.concat(grunt.task.normalizeMultiTaskFiles(obj));
    });

    files.forEach(function(filePair) {
      var isExpandedPair = filePair.orig.expand || false;
      filePair.src.forEach(function(src) {

        if(isDir(filePair.dest)) {
          dest = (isExpandedPair) ? filePair.dest : path.join(filePair.dest, src);
        }
        else {
          dest = filePair.dest;
        }


        if (grunt.file.isDir(src)) {
          grunt.verbose.writeln("Creating " + dest.cyan);
          grunt.file.mkdir(dest);
          tally.dirs++;
        } 
        else {
          if(shouldMerge(src)) {
            buffer = "";
            if(grunt.file.exists(dest)) {
              buffer += grunt.file.read(dest);
            }
            writtenMap[dest] = true;

            buffer += grunt.file.read(src);
            grunt.file.write(dest, buffer);
            tally.merged++;
          }
          else {
            grunt.verbose.writeln("Copying " + src.cyan + " -> " + dest.cyan);
            grunt.file.copy(src, dest);
            tally.copied++;           
          }
        }
      });
    });

    if (tally.dirs) {
      grunt.log.writeln("Created " + tally.dirs.toString().cyan + " directories.");
    }
    if (tally.copied) {
      grunt.log.writeln("Copied " + tally.copied.toString().cyan + " files.");
    }
    if (tally.merged) {
      grunt.log.writeln("Merged " + tally.merged.toString().cyan + " files");
    }

  });

  //This inane function is by convention from grunt-contrib-copy.  
  //I'm not going to mess with it, but I did rename it.  
  var isDir = function(dest) {
    if (grunt.util._.endsWith(dest, "/")) {
      return true;
    } 
    return false;
  };


};