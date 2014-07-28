/**
 * Mask Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        tpl = require( "tpl/mask" ),
        Widget = require( "widget/widget" ),
        $ = require( "base/jquery" ),
        __cache_inited = false,
        __MASK_CACHE = [];

    return Utils.createClass( "Mask", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                bgcolor: '#000',
                opacity: 0,
                inner: true,
                target: null,
                // 禁止mouse scroll事件
                scroll: false,
                hide: true
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

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

            this.__hideState = false;

        },

        hide: function () {

            this.callBase();

            this.__hideState = true;

        },

        isHide: function () {

            return this.__hideState;

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Mask';
            this.__tpl = tpl;

            this.__cacheId = __MASK_CACHE.length;
            this.__hideState = true;

            __MASK_CACHE.push( this );

            this.__target = this.__options.target;

            if ( this.__target instanceof Widget ) {
                this.__target = this.__target.getElement();
            }

        },

        __render: function () {

            this.callBase();

            this.__initMaskEvent();

            if ( !__cache_inited ) {
                __cache_inited = true;
                __initCacheEvent();
            }

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

                targetRect = $( Utils.getView( this.__target ) );
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

    // 全局监听
    function __initCacheEvent () {

        $( window ).on( "resize", function () {

            $.each( __MASK_CACHE, function ( i, mask ) {

                if ( mask && !mask.isHide() ) {
                    mask.__resize();
                }

            } );

        } );

    }

} );
