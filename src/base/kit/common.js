/**
 * 通用工具包
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        __marker = '__fui__marker__' + ( +new Date() );

    return {

        isElement: function ( target ) {
            return target.nodeType === 1;
        },

        getMarker: function () {

            return __marker;

        },

        getRect: function ( node ) {

            var rect = node.getBoundingClientRect();

            return {
                width: rect.width || $(node).width(),
                height: rect.height || $(node).height(),
                top: rect.top,
                bottom: rect.bottom,
                left: rect.left,
                right: rect.right
            };

        },

        getBound: function ( node ) {

            var w = 0,
                h = 0;

            if ( node.tagName.toLowerCase() === 'body' ) {

                h = $( this.getView( node ) );
                w = h.width();
                h = h.height();

                return {
                    top: 0,
                    left: 0,
                    bottom: h,
                    right: w,
                    width: w,
                    height: h
                };

            } else {

                return this.getRect( node );

            }

        },

        getView: function ( node ) {
            return node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
        }

    };

} );