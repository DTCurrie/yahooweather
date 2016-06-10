/* Gruntfile.js - Devin T. Currie */

module.exports = function (grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function (string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    // Grunt task config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Check JS Code for formatting and errors
        jshint: {
            // Files to check
            files: ['Gruntfile.js', 'app/js/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        // Compile LESS files
        less: {
            // Custom Site Less
            style: {
                options: {
                    strictMath: true
                },
                src: 'app/less/style.less',
                dest: 'app/css/style.css'
            }
        },
        concat: {
            css: {
                src: ['app/css/*.css'],
                dest: 'app/css/compiled/<%= pkg.name %>.css'
            },
            js: {
                src: ['app/js/*.js'],
                dest: 'app/js/compiled/<%= pkg.name %>.js'
            }
        },
        // Uglify JS files
        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'app/js/compiled/',
                    src: ['<%= pkg.name %>.js'],
                    dest: 'app/js/compiled/',
                    rename: function(destBase, destPath) {
                        return destBase+destPath.replace('.js', '.min.js');
                    }
                }]
            }
        },
        // Post Process CSS
        postcss: {
            all: {
                options: {
                    processors: [
                        require('pixrem')({rootValue: 10}), // add fallbacks for rem units
                        require('postcss-unnth')(),
                        require('postcss-pseudoelements')(),
                        require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
                    ]
                },
                src: 'app/css/compiled/*.css'
            }
        },
        // Minify CSS files
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                advanced: false,
                sourceMap: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'app/css/compiled/',
                    src: ['<%= pkg.name %>.css'],
                    dest: 'app/css/compiled/',
                    ext: '.min.css'
                }]
            }
        },
        // Add banners to uglified/minified JS/CSS files
        usebanner: {
            addBanners: {
                options: {
                    position: 'top',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
                    linebreak: true
                },
                files: {
                    src: [
                        'app/css/compiled/*.min.css',
                        'app/js/compiled/*.min.css'
                    ]
                }
            }
        },
        // Add package version to link/script calls in index.html
        cache_control: {
            index: {
                source: "index.html",
                options: {
                    version: "<%= pkg.version %>",
                    links: true,
                    scripts: true,
                    replace: true,
                    ignoreCDN: true
                }
            }
        },
        copy: {
            js: {
                expand: true,
                cwd: 'app/js/compiled/',
                src: [
                    '<%= pkg.name %>.min.js',
                    '<%= pkg.name %>.min.js.map'
                ],
                dest: 'widget/'
            },
            css: {
                expand: true,
                cwd: 'app/css/compiled/',
                src: [
                    '<%= pkg.name %>.min.css',
                    '<%= pkg.name %>.min.css.map'
                ],
                dest: 'widget/'
            },
            views: {
                expand: true,
                cwd: 'app/views/',
                src: ['index.html'],
                dest: 'widget/'
            }
        },
        watch: {
            css: {
                files: ['app/css/*.css'],
                tasks: ['concat:css', 'postcss', 'cssmin', 'usebanner', 'cache_control', 'copy:css', 'copy:views']
            },
            less: {
                files: ['app/less/*.less'],
                tasks: ['less']
            },
            js: {
                files: ['app/js/*.js'],
                tasks: ['concat:js', 'uglify', 'usebanner', 'cache_control', 'copy:js', 'copy:views']
            },
            views: {
                files: ['app/views/*.html'],
                tasks: ['cache_control', 'copy:views']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-cache-control');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Register tasks, run in order declared
    grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify', 'postcss', 'cssmin', 'usebanner', 'cache_control', 'copy', 'watch']);
};