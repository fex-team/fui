/**
 * UI构造工厂, 提供可通过参数配置项创建多个构件的机制.
 */

define( function ( require ) {

    var Creator = {},
        $ = require( "base/jquery" ),
        FUI_NS = require( "base/ns" );

    $.extend( Creator, {

        parse: function ( options ) {

            var pool = [];

            if ( $.isArray( options ) ) {

                $.each( options, function ( i, opt ) {

                    pool.push( getInstance( opt ) );

                } );

                return pool;

            } else {

                return getInstance( options );

            }

        }

    } );

    function getInstance ( option ) {

        var Constructor = FUI_NS[ option.clazz ];

        if ( !Constructor ) {
            return null;
        }

        return new Constructor( option );

    }

    return Creator;

} );