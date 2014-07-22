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
