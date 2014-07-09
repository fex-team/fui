/**
 * Mask Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        tpl = require( "tpl/mask" ),
        Widget = require( "widget/widget" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Mask", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                bgcolor: '#000',
                opacity: 0,
                inner: true,
                // 禁止mouse scroll事件
                scroll: false
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Mask';
            this.__tpl = tpl;

            this.__target = this.__options.target;

            if ( this.__target instanceof Widget ) {
                this.__target = this.__target.getElement();
            }

            if ( options !== marker ) {
                this.__render();
            }

        },

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            this.__initMaskEvent();

        },

        maskTo: function ( target ) {

            if ( target ) {
                this.__target = target;
            }

            return this;

        },

        show: function () {

            var docNode = null;

            if ( !this.__target ) {
                this.__target = this.__element.ownerDocument.body;
            }

            docNode = this.__target.ownerDocument.documentElement;

            // 如果节点未添加到dom树， 则自动添加到文档的body节点上
            if ( !$.contains( docNode, this.__element ) ) {
                this.appendTo( this.__target.ownerDocument.body );
            }

            this.callBase();

            this.__position();
            this.__resize();

        },

        __initMaskEvent: function () {

            this.on( "mousewheel", function ( e ) {

                var evt = e.originalEvent;

                e.preventDefault();
                e.stopPropagation();

                this.trigger( "scroll", {
                    delta: evt.wheelDelta || evt.deltaY || evt.detail
                } );

            } );

            this.on( "click", function ( e ) {

                e.stopPropagation();

                if ( e.target === this.__element ) {
                    this.trigger( "maskclick" );
                }

            } );

        },

        // 定位
        __resize: function () {

            var targetRect = null;

            // body特殊处理
            if ( this.__targetIsBody() ) {

                targetRect = $( this.__target.ownerDocument.defaultView );
                targetRect = {
                    width: targetRect.width(),
                    height: targetRect.height()
                }

            } else {
                targetRect = Utils.getRect( this.__target );
            }

            this.__element.style.width = targetRect.width + 'px';
            this.__element.style.height = targetRect.height + 'px';

        },

        __position: function () {

            var location = null,
                targetRect = null;

            if ( this.__targetIsBody() ) {

                location = {
                    top: 0,
                    left: 0
                };

            } else {

                targetRect = Utils.getRect( this.__target );

                location = {
                    top: targetRect.top,
                    left: targetRect.left
                };

            }

            $( this.__element ).css( 'top', location.top + 'px' ).css( 'left', location.left + 'px' );

        },

        __targetIsBody: function () {
            return this.__target.tagName.toLowerCase() === 'body';
        }

    } );
} );
