# grunt-copycat

> A combination copy and concatenation task designed for doing a careful merge of directories.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-copycat --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-copycat');
```

## The "copycat" task

### Overview
In your project's Gruntfile, add a section named `copycat` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  copycat: {
    dirs : [dir1, dir2, dir3]
  },
})
```

### Options

#### options.merge

This function will be called for every file.  If it returns true, the task will concatenate the file instead of copying it.  

### Usage Examples

This example takes three directories and copies them to test/target/, with dir3 having the highest priority.  

If the file has the .css extension, duplicate files within each directory will not be overwritten in test/target/, but will instead be concatenated.  

```js
grunt.initConfig({
  copycat: {
    example : {
      dirs : ["test/dir1", "test/dir2", "test/dir3"],
      dest : "test/target/",
      options: {
        merge : function(file) {
          if(file.split(".").pop()==="css") {
            return true;
          }
            
          return false;
        }
      }
	}
  },
})
```


## Release History

* Initial Commit
* Tests and change to merge option functionality
* Updated Readme