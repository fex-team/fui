/*jshint camelcase:false*/
/**
 * 容器类： PPanel = Positioning Panel
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        Widget = require( "widget/widget" ),
        LAYOUT = CONF.layout,
        $ = require( "base/jquery" );

    return Utils.createClass( "PPanel", {

        base: require( "widget/panel" ),

        constructor: function ( options ) {

            var defaultOptions = {
                layout: LAYOUT.BOTTOM,
                target: null,
                // 边界容器
                bound: null,
                // 和边界之间的最小距离
                diff: 10,
                hide: true,
                resize: 'all'
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        positionTo: function ( target, layout ) {

            if ( target instanceof Widget ) {
                target = target.getElement();
            }

            this.__target = target;

            if ( layout ) {
                this.__layout = layout;
            }

            return this;
        },

        show: function () {

            var docNode = null;

            if ( !this.__target ) {
                return this.callBase();
            }

            if ( !this.__options.bound ) {
                this.__options.bound = this.__target.ownerDocument.body;
            }

            docNode = this.__target.ownerDocument.documentElement;

            if ( !$.contains( docNode, this.__element ) ) {
                this.__target.ownerDocument.body.appendChild( this.__element );
            }

            if ( $.contains( docNode, this.__target ) ) {
                this.callBase( Utils.getMarker() );
                this.__position();
                this.__resize();
            }

            return this;

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'PPanel';

            this.__target = this.__options.target;
            this.__layout = this.__options.layout;

            // 记录是否已调整过高度
            this.__height_resized = false;

        },

        __render: function () {

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "ppanel" );

        },

        // 执行定位
        __position: function () {

            var location = null,
                className = CONF.classPrefix + "ppanel-position";

            $( this.__element ).addClass( className );

            location = this.__getLocation();

            $( this.__element ).css( 'top', location.top + 'px' )
                               .css( 'left', location.left + 'px' );

        },

        __resize: function () {

            var targetRect = Utils.getBound( this.__target );

            switch ( this.__options.resize ) {

                case 'all':
                    this.__resizeWidth( targetRect );
                    this.__resizeHeight();
                    break;

                case 'width':
                    this.__resizeWidth( targetRect );
                    break;

                case 'height':
                    this.__resizeHeight();
                    break;

            }

        },

        /**
         * 在未指定宽度的情况下，执行自动宽度适配。
         * 如果构件未被指定宽度， 则添加一个最小宽度， 该最小宽度等于给定目标的宽度
         * @param targetRect 传递该参数，是出于整体性能上的考虑。
         * @private
         */
        __resizeWidth: function ( targetRect ) {

            if ( !this.__target ) {
                return;
            }

            var $ele = $( this.__element ),
                w = $ele.outerWidth(),
                h = $ele.outerHeight(),
                minWidth = targetRect.width - w - h;

            this.__element.style.minWidth = minWidth + 'px';

        },

        /**
         * 调整panel高度，使其不超过边界范围，如果已设置高度， 则不进行调整
         * @private
         */
        __resizeHeight: function () {

            var boundRect = null,
                panelRect = null,
                diff = 0;

            panelRect = Utils.getRect( this.__element );
            panelRect.height = this.__element.scrollHeight;
            panelRect.bottom = panelRect.top + panelRect.height;

            boundRect = this.__getBoundRect();

            diff = panelRect.bottom - boundRect.bottom;

            if ( diff > 0 ) {

                this.__height_resized = true;
                diff = panelRect.height - diff - this.__options.diff;
                $( this.__element ).css( "height", diff + 'px' );

            } else if ( this.__height_resized ) {

                this.__element.style.height = null;

            }

        },

        __getLocation: function () {

            var targetRect = Utils.getBound( this.__target );

            switch ( this.__layout ) {

                case LAYOUT.CENTER:
                case LAYOUT.MIDDLE:
                    return this.__getCenterLayout( targetRect );

                case LAYOUT.LEFT:
                case LAYOUT.RIGHT:
                case LAYOUT.BOTTOM:
                case LAYOUT.TOP:
                    return this.__getOuterLayout( targetRect );

                default:
                    return this.__getInnerLayout( targetRect );

            }



            return location;

        },

        /**
         * 居中定位的位置属性
         * @private
         */
        __getCenterLayout: function ( targetRect ) {

            var location = {
                    top: 0,
                    left: 0
                },
                panelRect = Utils.getRect( this.__element ),
                diff = 0;

            diff = targetRect.height - panelRect.height;

            if ( diff > 0 ) {
                location.top = targetRect.top + diff / 2;
            }

            diff = targetRect.width - panelRect.width;

            if ( diff > 0 ) {
                location.left = targetRect.left + diff / 2;
            }

            return location;

        },

        /**
         * 获取外部布局定位属性
         * @returns {{top: number, left: number}}
         * @private
         */
        __getOuterLayout: function ( targetRect ) {

            var location = {
                    top: 0,
                    left: 0
                },
                panelRect = Utils.getRect( this.__element );

            switch ( this.__layout ) {

                case LAYOUT.TOP:
                    location.left = targetRect.left;
                    location.top = targetRect.top - panelRect.height;
                    break;

                case LAYOUT.LEFT:
                    location.top = targetRect.top;
                    location.left = targetRect.left - panelRect.width;
                    break;

                case LAYOUT.RIGHT:
                    location.top = targetRect.top;
                    location.left = targetRect.right;
                    break;

                case LAYOUT.BOTTOM:
                /* falls through */
                default:
                    location.left = targetRect.left;
                    location.top = targetRect.bottom;
                    break;

            }

            return location;

        },

        /**
         * 获取内部布局定位属性,并且，内部布局还拥有根据水平空间的大小，自动进行更新定位的功能
         * @private
         */
        __getInnerLayout: function ( targetRect ) {

            var location = {
                    top: 0,
                    left: 0
                },
                rect = targetRect,
                panelRect = Utils.getRect( this.__element );

            switch ( this.__layout ) {

                case LAYOUT.LEFT_TOP:
                    location.top = rect.top;
                    location.left = rect.left;
                    break;

                case LAYOUT.RIGHT_TOP:
                    location.top = rect.top;
                    location.left = rect.left + rect.width - panelRect.width;
                    break;

                case LAYOUT.LEFT_BOTTOM:
                    location.top = rect.top + rect.height - panelRect.height;
                    location.left = rect.left;
                    break;

                case LAYOUT.RIGHT_BOTTOM:
                    location.top = rect.top + rect.height - panelRect.height;
                    location.left = rect.left + rect.width - panelRect.width;
                    break;

            }

            return this.__correctionLocation( location );

        },

        __getBoundRect: function () {

            var width = -1,
                height = -1,
                view = null;

            if ( this.__options.bound.tagName.toLowerCase() === 'body' ) {

                view = Utils.getView( this.__options.bound );

                width = $( view ).width();
                height = $( view ).height();

                return {
                    top: 0,
                    left: 0,
                    right: width,
                    bottom: height,
                    width: width,
                    height: height
                };

            } else {
                return Utils.getRect( this.__options.bound );
            }

        },

        // 如果发生“溢出”，则修正定位
        __correctionLocation: function ( location ) {

            var panelRect = Utils.getRect( this.__element ),
                targetRect = Utils.getRect( this.__target ),
                boundRect = this.__getBoundRect();

            switch ( this.__layout ) {

                case LAYOUT.LEFT_TOP:
                case LAYOUT.LEFT_BOTTOM:

                    if ( location.left + panelRect.width > boundRect.right  ) {
                        location.left += targetRect.width - panelRect.width;
                    }
                    break;

                case LAYOUT.RIGHT_TOP:
                case LAYOUT.RIGHT_BOTTOM:

                    if ( location.left < boundRect.left  ) {
                        location.left = targetRect.left;
                    }
                    break;

            }

            return location;

        }

    } );

} );
