/**
 * 模板编译器
 */

define( function ( require ) {

    var vash = require( "base/vash" ),
        $ = require( "base/jquery" ),
        defaultOptions = {
            htmlEscape: false,
            helpersName: 'h',
            modelName: 'm'
        };

    $.extend( vash.helpers, {

        toSpaceStyle: function ( space ) {

            var styleText = [];

            if ( $.isNumeric( space.width ) ) {
                styleText.push( 'width:' + space.width + 'px' );
            }

            if ( $.isNumeric( space.height ) ) {
                styleText.push( 'height:' + space.height + 'px' );
            }

            return styleText.join( ';' );

        },

        // css序列化
        toCssText: function ( cssMapping ) {

            var rules = [],
                value = null;

            if ( !cssMapping ) {
                return '';
            }

            for ( var key in cssMapping ) {

                if ( !cssMapping.hasOwnProperty( key ) ) {
                    continue;
                }

                value = cssMapping[ key ];

                rules.push( key + ': ' + value + ( $.isNumeric( value ) ? 'px' : '' ) );

            }

            if ( rules.length === 0 ) {
                return '';
            }

            return 'style="' + rules.join( ";" ) + '"';

        }

    } );

    return {
        compile: function ( tpl, data, compileOptions ) {

            tpl = $.trim( tpl );

            if ( tpl.length === 0 ) {
                return "";
            }

            compileOptions = $.extend( true, {}, defaultOptions, compileOptions );

            var tpl = vash.compile( tpl, compileOptions );

            return tpl( data );

        }
    };

} );
