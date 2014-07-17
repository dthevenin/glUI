/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  var sources = grunt.file.readJSON ('build.json');
  
  // create core file list for debuging
  // Its include the profiling code
  var core_debug = sources.core.slice (0, sources.core.length - 2);
  core_debug = core_debug.concat (sources.profiling);
  core_debug.push (sources.core [sources.core.length - 1]);
  
  grunt.initConfig({
    concat: {
      options: {
        separator: '\n'
      },
      core: {
        src: sources.core,
        dest: 'lib/core.js'
      },
      core_release: {
        src: sources.core,
        dest: 'lib/core.js'
      },
      core_debug: {
        src: core_debug,
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
      },
      recognizers: {
        src: sources.recognizers,
        dest: 'lib/recognizers.js'
      },
      widgets: {
        src: sources.widget,
        dest: 'lib/widgets.js'
      }
    },
    copy: {
      platform: {
        src: 'bower_components/CustomElements/platform.js',
        dest: 'lib/custom_elements.js'
      },
      requirejs: {
        src: 'bower_components/requirejs/require.js',
        dest: 'lib/require.js'
      },
      customElements: {
        flatten: true,
        expand: true,
        src: ['src/glengine.html', 'src/recognizers/recognizers.html', 'src/widget/widgets.html'],
        dest: 'lib/'
      },
      demosLib: {
        expand: true,
        flatten: true,
        cwd: 'lib/',
        src: '**',
        dest: 'demos/lib/'
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
    'concat:core_debug',
    'concat:util',
    'concat:class',
    'concat:webcomponent',
    'concat:recognizers',
    'concat:widgets',
    'copy:platform',
    'copy:customElements',
    'copy:requirejs',
    'copy:demosLib'
   ]);
};
