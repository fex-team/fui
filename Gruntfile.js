/**
 * FUI Grunt file
 **/

module.exports = function(grunt) {

    var cssBanner = '/*!\n' +
        ' * ====================================================\n' +
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * GitHub: <%= pkg.repository.url %> \n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
        ' * ====================================================\n' +
        ' */\n';

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        tpl: {
            source: {
                src: [ 'src/tpl/origin/**/*.html' ]
            }
        },

        watch: {
            build: {
                files: [ 'src/tpl/origin/**/*.html' ]
            },
            less: {
                files: [ "theme/default/widget.less", "theme/default/container.less", "theme/default/**.less" ],
                tasks: [ 'less:develop' ]
            }
        },

        less: {
            develop: {
                files: {
                    'theme/default/fui.all.css': [ "theme/default/widget.less", "theme/default/container.less", "theme/default/**.less" ]
                }
            },
            build: {
                files: {
                    'dist/theme/default/fui.css': [ "theme/default/widget.less", "theme/default/container.less", "theme/default/**.less" ]
                }
            }
        },

        // 最终代码合并
        concat: {

            full: {

                options: {

                    banner: '/*!\n' +
                        ' * ====================================================\n' +
                        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
                        ' * GitHub: <%= pkg.repository.url %> \n' +
                        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
                        ' * ====================================================\n' +
                        ' */\n\n' +
                        '(function () {\n',

                    footer: '})();'

                },

                dest: 'dist/' + getFileName(),
                src: [ '.tmp_build/fui.tmp.js', 'dev-lib/start.js' ]

            }

        },

        // 压缩
        uglify: {

            options: {

                banner: cssBanner,

                beautify: {
                    ascii_only: true
                }

            },

            minimize: {

                dest: 'dist/' + getFileName( true ),
                src: 'dist/' + getFileName()

            }

        },

        // 模块依赖合并
        dependence: {

            replace: {

                options: {
                    base: 'src',
                    entrance: 'fui.export'
                },

                files: [ {
                    src: [ 'src/**/*.js', 'dev-lib/exports.js' ],
                    dest: '.tmp_build/fui.tmp.js'
                } ]

            }
        },

        // hint检查
        jshint: {
            options: {
                ignores: [ 'src/base/canvg.js' ],
                jshintrc: '.jshintrc'
            },
            check: [ 'src/**/*.js' ]
        },

        cssmin: {
            options: {
                banner: '/*!\n' +
                    ' * ====================================================\n' +
                    ' * Themes file' +
                    ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
                    ' * GitHub: <%= pkg.repository.url %> \n' +
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                    ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
                    ' * ====================================================\n' +
                    ' */\n'
            },

            min: {
               files: {
                   'dist/theme/default/fui.min.css': [ 'dist/theme/default/fui.css' ]
               }
            }
        },

        copy: {
            image: {
                expand: true,
                src: [ 'theme/default/images/**' ],
                dest: 'dist/'
            }
        },

        // 临时目录清理
        clean: {
            files: [ '.tmp_build' ]
        }

    });

    grunt.event.on( 'watch', function ( action, filepath, target ) {

        if ( !/\.less$/.test( filepath ) ) {
            rebuildTpl( filepath );
        }

    } );

    function rebuildTpl ( filepath ) {

        var originSouce = grunt.file.read( filepath ),
            targetFile = filepath.replace( 'src/tpl/origin/', 'src/tpl/' ).replace( /html$/, 'js' ),
            result = [];

        originSouce.split( '\n' ).forEach( function ( source ) {
            source = source.trim();
            if ( source.length ) {
                result.push( "'" + source.trim().replace( /'/g, '\\\'' ) + "'" );
            }
        } );

        grunt.file.write( targetFile, getTplSouce(  result ) );

        return targetFile;

    }

    function getTplSouce ( tplSouceArr ) {

        return 'define( function () {\n' +
                'return ' +
                tplSouceArr.join( ' +\n' ).replace( /<[^\/\s>]+/g, function ( match ) {
                    return match + ' unselectable="on"';
                } ) +
                '\n} );';

    }

    function getFileName ( isMin ) {

        return isMin ? 'fui.all.min.js' : 'fui.all.js';

    }

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-module-dependence');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerMultiTask( 'tpl', function () {

        this.filesSrc.forEach( function ( filepath ) {
            var targetFile = rebuildTpl( filepath );
            grunt.log.writeln( 'File ' + targetFile.cyan + ' created.' );
        } );

    } );

    grunt.registerTask( 'default', [ 'jshint' ] );
    grunt.registerTask( 'dev', [ 'less', 'tpl', 'watch' ] );
    grunt.registerTask( 'build', [ /*'jshint', */'dependence:replace', 'concat:full', 'uglify:minimize', 'less:build', 'cssmin', 'copy', 'clean' ] );

};
