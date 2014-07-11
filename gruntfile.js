/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  var readManifest = require('./submodules/tools/loader/readManifest.js');

  var sources = grunt.file.readJSON ('build.json');
  
  grunt.initConfig({
    concat: {
      options: {
        separator: '\n'
      },
      core: {
        src: sources.core,
        dest: 'lib/core.js'
      },
      util: {
        src: sources.util,
        dest: 'lib/util.js'
      },
      class: {
        src: sources.class,
        dest: 'lib/class.js'
      },
      webcomponent: {
        src: sources.webcomponent,
        dest: 'lib/webcomponent.js'
      }
    },
    copy: {
      customElements: {
        src: 'bower_components/CustomElements/platform.js',
        dest: 'lib/custom_elements.js'
      },
      requirejs: {
        src: 'bower_components/requirejs/requirejs.js',
        dest: 'lib/requirejs.js'
      },
      glengine: {
        src: 'src/glengine.html',
        dest: 'lib/glengine.html'
      }
    }
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-contrib-copy');
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // tasks
  // tasks
  grunt.registerTask('default', [
    'concat:core',
    'concat:util',
    'concat:class',
    'concat:webcomponent',
    'copy:customElements',
    'copy:glengine',
    'copy:requirejs'
   ]);
};
