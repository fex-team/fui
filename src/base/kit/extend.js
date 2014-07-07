/**
 * 弥补jQuery的extend在克隆对象和数组时存在的问题
 */


define( function ( require ) {

    var $ = require( "base/jquery" );

    function extend ( target ) {

        var type = null,
            isPlainObject = false,
            isArray = false,
            sourceObj = null;

        if ( arguments.length === 1 ) {
            return copy( target );
        }

        $.each( [].slice.call( arguments, 1 ), function ( i, source ) {

            for ( var key in source ) {

                sourceObj = source[ key ];

                if ( !source.hasOwnProperty( key ) ) {
                    continue;
                }

                isPlainObject = $.isPlainObject( sourceObj );
                isArray = $.isArray( sourceObj );

                if ( !isPlainObject && !isArray ) {

                    target[ key ] = source[ key ]

                } else if ( isPlainObject ) {

                    if ( !$.isPlainObject( target[ key ] ) ) {
                        target[ key ] = {};
                    }

                    target[ key ] = extend( target[ key ], sourceObj );

                } else if ( isArray ) {

                    target[ key ] = extend( sourceObj );

                }

            }

        } );

        return target;

    }

    function copy ( target ) {

        var tmp = null;

        if ( $.isPlainObject( target ) ) {

            return extend( {}, target );

        } else if ( $.isArray( target ) ) {

            tmp = [];

            $.each( target, function ( index, item ) {

                if ( $.isPlainObject( item ) || $.isArray( item ) ) {
                    tmp.push( copy( item ) );
                } else {
                    tmp.push( item );
                }

            } );

            return tmp;

        } else {

            return target;

        }

    }

    return extend;

} );