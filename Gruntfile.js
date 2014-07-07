/**
 * FUI Grunt file
 **/

module.exports = function(grunt) {

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
                    'theme/fui.all.css': [ "theme/default/widget.less", "theme/default/container.less", "theme/default/**.less" ]
                }
            }
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

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerMultiTask( 'tpl', function () {

        this.filesSrc.forEach( function ( filepath ) {
            var targetFile = rebuildTpl( filepath );
            grunt.log.writeln( 'File ' + targetFile.cyan + ' created.' );
        } );

    } );

    grunt.registerTask( 'dev', [ 'less', 'tpl', 'watch' ] );

};
