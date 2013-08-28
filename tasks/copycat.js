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
    // This map indicates whether a file in the destination has been written to before,
    // in order to make sure that, if you run the task multiple times, the file in question
    // doesn't continue to grow.
    var writtenMap = {};
    

    //The function that indicates when file data should be appended instead of overwritten.
    var options = this.options();
    var shouldMerge = options.merge || function(){return false;};


    //Grunt's provided file globbing is discarded.  You could make the argument that 
    //since copycat does not respect the files[{src:...,dest:...],...}] syntax
    //this.data.dest should be named something else instead.  

    //I chose to follow convention.  
    var obj = {dest : this.data.dest, expand:true};
    var files = [];

    if(!grunt.util._.isArray(this.data.dirs)) {
      grunt.error("No directories array specified.");
    }

    this.data.dirs.forEach(function(dir) {
      obj.cwd = dir;
      obj.src = "**";
      files = files.concat(grunt.task.normalizeMultiTaskFiles(obj));
    });
    //We now have a list of files arranged in such an order such that previous copies/concats
    //shall be overridden/appended as specified in the order of the dirs array.


    var dest;
    var buffer;
    var tally = {
      merged : 0,
      dirs : 0,
      copied : 0
    };
    var path = require("path");

    //This is a essentially a straight port of the grunt-contrib-copy source code
    //with a switch in the middle to concatenate instead.  
    files.forEach(function(filePair) {
      var isExpandedPair = filePair.orig.expand || false;
      filePair.src.forEach(function(src) {

        if(isDir(filePair.dest)) {
          dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
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
            if(grunt.file.exists(dest)&&writtenMap[dest]) {
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
      grunt.log.writeln("Merged " + tally.merged.toString().cyan + " files.");
    }

  });

  //This somewhat blunt function is by convention from grunt-contrib-copy.  
  //I reworked it slightly.  
  var isDir = function(dest) {
    if (grunt.util._.endsWith(dest, "/")) {
      return true;
    } 
    return false;
  };

  //It makes me unhappy that this is necessary to code on an individual plug-in.  
  var unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };
};