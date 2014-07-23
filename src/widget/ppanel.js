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

            var marker = Utils.getMarker();
            this.callBase( marker );

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

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'PPanel';

            this.__target = this.__options.target;
            this.__layout = this.__options.layout;

            // 记录是否已调整过高度
            this.__height_resized = false;

            if ( this.__target instanceof Widget ) {
                this.__target = this.__target.getElement();
            }

            if ( options !== marker ) {
                this.__render();
                this.__initWidgets();
            }

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

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "ppanel" );

        },

        // 执行定位
        __position: function () {

            var location = null;

            $( this.__element ).addClass( CONF.classPrefix + "ppanel-position" );


            location = this.__getLocation();

            $( this.__element ).css( 'top', location.top + 'px' ).css( 'left', location.left + 'px' );

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
                vals = {
                    bl: parseInt( $ele.css( 'border-left-width' ), 10 ) || 0,
                    br: parseInt( $ele.css( 'border-right-width' ), 10 ) || 0,
                    pl: parseInt( $ele.css( 'padding-left' ), 10 ) || 0,
                    pr: parseInt( $ele.css( 'padding-right' ), 10 ) || 0
                },
                minWidth = targetRect.width - vals.bl - vals.br - vals.pl - vals.pr;

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

            if ( this.__options.bound.tagName.toLowerCase() === 'body' ) {

                boundRect = {
                    top: 0,
                    bottom: $( this.__options.bound.ownerDocument.defaultView ).height()
                };

            } else {
                boundRect = Utils.getRect( this.__options.bound );
            }

            diff = panelRect.bottom - boundRect.bottom;

            if ( diff > 0 ) {

                this.__height_resized = true;
                $( this.__element ).css( "height", panelRect.height - diff - this.__options.diff + 'px' );

            } else if ( this.__height_resized ) {

                this.__element.style.height = null;

            }

        },

        __getLocation: function () {

            var targetRect = Utils.getBound( this.__target ),
                location = null;

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
                panelRect = Utils.getRect( this.__element );

            switch ( this.__layout ) {

                case LAYOUT.TOP:
                case LAYOUT.LEFT:
                    location.left = targetRect.left;
                    location.top = targetRect.top;
                    break;

                case LAYOUT.RIGHT:
                case LAYOUT.BOTTOM:
                    location.top = targetRect.bottom - panelRect.height;
                    location.left = targetRect.right - panelRect.width;
                    break;

            }



            return location;

        }

    } );

} );
