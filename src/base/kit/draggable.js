/**
 * Draggable Lib
 */

define( function ( require, exports ) {

    var $ = require( "base/jquery" ),
        common = require( "base/kit/common" ),
        DEFAULT_OPTIONS = {
            handler: null,
            target: null,
            axis: 'all',
            range: null
        };

    function Draggable ( options ) {

        this.__options = $.extend( {}, DEFAULT_OPTIONS, options );

        this.__started = false;

        this.__point = {
            x: 0,
            y: 0
        };

        this.__location = {
            x: 0,
            y: 0
        };

        this.__range = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        };

    }

    $.extend( Draggable.prototype, {

        bind: function ( target ) {

            if ( target ) {
                this.__options.target = target;
            }

            if ( !this.__options.target ) {
                throw new Error( 'target unset' );
            }

            this.__target = this.__options.target;
            this.__handler = this.__options.handler;
            this.__rangeNode = this.__options.range;

            this.__initOptions();

            this.__initEnv();
            this.__initEvent();

        },

        __initEvent: function () {

            var target = this.__target,
                handler = this.__handler,
                _self = this;

            $( handler ).on( "mousedown", function ( e ) {

                var location = common.getRect( handler );

                e.preventDefault();

                _self.__started = true;

                _self.__point = {
                    x: e.clientX,
                    y: e.clientY
                };

                _self.__location = {
                    x: location.left,
                    y: location.top
                }

                _self.__range = _self.__getRange();

            } );

            $( handler.ownerDocument ).on( "mousemove", function ( e ) {

                if ( !_self.__started ) {
                    return;
                }

                var x = e.clientX,
                    y = e.clientY;

                if ( _self.__allowAxisX ) {
                    _self.__xMove( x );
                }

                if ( _self.__allowAxisY ) {
                    _self.__yMove( y );
                }

            }).on( "mouseup", function ( e ) {
                _self.__started = false;
            } );

        },

        __xMove: function ( x ) {

            var diff = x - this.__point.x;

            diff = this.__location.x + diff;

            if ( diff < this.__range.left ) {

                diff = this.__range.left;

            } else if ( diff > this.__range.right ) {

                diff = this.__range.right;

            }

            this.__target.style.left = diff + 'px';

        },

        __yMove: function ( y ) {

            var diff = y - this.__point.y;

            diff = this.__location.y + diff;

            if ( diff < this.__range.top ) {

                diff = this.__range.top;

            } else if ( diff > this.__range.bottom ) {

                diff = this.__range.bottom;

            }

            this.__target.style.top = diff + 'px';

        },

        __initEnv: function () {

            var $target = $( this.__target );

            $target.css( "position", "fixed" );

        },

        __initOptions: function () {

            var axis = this.__options.axis.toLowerCase();

            if ( !this.__handler ) {
                this.__handler = this.__target;
            }

            if ( !this.__rangeNode ) {
                this.__rangeNode = this.__options.target.ownerDocument.body;
            }

            this.__allowAxisX = this.__options.axis !== 'y';
            this.__allowAxisY = this.__options.axis !== 'x';

        },

        __getRange: function () {

            var range = this.__rangeNode,
                targetRect = common.getRect( this.__target );

            if ( range.tagName.toLowerCase() === 'body' ) {

                range = $( this.__rangeNode.ownerDocument );

                range = {
                    top: 0,
                    left: 0,
                    bottom: range.height(),
                    right: range.width()
                };

            } else {

                range = common.getRect( range );

            }

            return {
                top: range.top,
                left: range.left,
                bottom: range.bottom - targetRect.height,
                right: range.right - targetRect.width
            };

        }

    } );

    return Draggable;

} );