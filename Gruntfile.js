"use strict";
module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-madge');

  function toFile(dir) {
    return dir + "/*.js";
  };
  
  var testDirectories = ['tests', 'tests/*', 'examples'];
  var testFiles = testDirectories.map(toFile);
  var productionDirectories = ['.', 'detail'];
  var productionFiles = productionDirectories.map(toFile);
  
  var allFiles = productionFiles.concat(testFiles);
  
  grunt.initConfig({
    watch : {
      files : allFiles,
      tasks : 'default'
    },
    jshint : {
      files : allFiles
	  },
	  madge: {
	    all: allFiles
	  },
    mocha_istanbul: {
      coverage: {
        src: testFiles
      }
    }
  });

  grunt.registerTask('default', 'mocha_istanbul');
};