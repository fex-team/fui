/**
 * UI构造工厂, 提供可通过参数配置项创建多个构件的机制.
 */

define( function ( require ) {

    var Creator = {},
        $ = require( "base/jquery" ),
        FUI_NS = require( "base/ns" );

    $.extend( Creator, {

        parse: function ( options ) {

            var pool = {},
                instance = null,
                optionList = null;

            for ( var widgetClazz in options ) {

                if ( !options.hasOwnProperty( widgetClazz ) ) {
                    continue;
                }

                optionList = options[ widgetClazz ];
                widgetClazz = FUI_NS[ widgetClazz ];

                if ( !widgetClazz ) {
                    continue;
                }

                if ( !$.isArray( optionList ) ) {
                    optionList = [ optionList ];
                }

                $.each( optionList, function ( i, opt ) {

                    instance = new widgetClazz( opt );

                    pool[ instance.getId() ] = instance;

                } );

            }

            return pool;

        }

    } );

    return Creator;

} );