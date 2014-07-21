/**
 * 模板编译器
 */

define( function ( require ) {

    var jhtmls = require( "base/jhtmls" ),
        $ = require( "base/jquery" );

    var Helper = {

        forEach: function ( arras, cb ) {

            $.each( arras, function ( i, item ) {

                cb.call( null, i, item );

            } );

        },

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

    };

    return {

        compile: function ( tpl, data ) {

            tpl = $.trim( tpl );

            if ( tpl.length === 0 ) {
                return "";
            }

            return jhtmls.render( tpl, data, Helper );

        }

    };

} );
