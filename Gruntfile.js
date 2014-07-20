var path = require('path');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-react');

  grunt.initConfig({
    public: 'lib/twitter_flow/public',
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      react: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/react/',
            src: ['react.js','react.min.js'],
            dest: '<%= public %>/js/'
          }
        ]
      },
      aviator: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/aviator/',
            src: ['aviator.js'],
            dest: '<%= public %>/js/',
          }
        ]
      },
      reqwest: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/reqwest/',
            src: ['reqwest.js'],
            dest: '<%= public %>/js/'
          }
        ]
      },
      vendor: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'assets/vendor/',
            src: ['*.js'],
            dest: '<%= public %>/js/'
          }
        ]
      },
      js: {
        files: [
          {
            expand: true,
            cwd: 'assets/js/',
            src: ['**/*.js'],
            dest: 'tmp/js/'
          }
        ]
      }
    },
    react: {
      jsx: {
        files: [
          {
            expand: true,
            cwd: 'assets/jsx',
            src: '**/*.jsx',
            dest: 'tmp/js',
            ext: '.js'
          }
        ]
      }
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ''
      },
      js: {
        // the files to concatenate
        src: ['tmp/js/**/*.js'],
        // the location of the resulting JS file
        dest: '<%= public %>/js/<%= pkg.name %>.js'
      },
      css: {
        src: ['assets/less/**/*.less'],
        dest: 'tmp/less/<%= pkg.name %>.less'
      }
    },
    uglify: {
      js: {
        files: {
          '<%= public %>/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>'],
        }
      }
    },
    recess: {
      dist: {
        options: {
          compile: true
        },
        files: {
          '<%= public %>/css/<%= pkg.name %>.css': 'tmp/less/*.less'
        }
      },
      min: {
        options: {
          compress: true
        },
        files: {
          '<%= public %>/css/<%= pkg.name %>.min.css': '<%= public %>/css/<%= pkg.name %>.css',
        }
      }
    },
    watch: {
      all: {
        files: ['assets/js/**/*', 'assets/less/**/*', 'assets/jsx/**/*'],
        tasks: ['copy:js', 'react:jsx', 'concat:js', 'concat:css', 'uglify:js', 'recess:dist', 'recess:min', 'timestamp']
      }
    }
  });

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  grunt.registerTask('default', ['copy', 'react', 'concat', 'uglify', 'recess']);
};
