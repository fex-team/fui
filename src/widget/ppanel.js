/**
 * 容器类： PPanel = Positioning Panel
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        $ = require( "base/jquery" );

    var LAYOUT = {
        TOP: 'top',
        LEFT: 'left',
        BOTTOM: 'bottom',
        RIGHT: 'right'
    };

    return Utils.createClass( "PPanel", {

        base: require( "widget/panel" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                layout: LAYOUT.BOTTOM,
                target: null
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'PPanel';

            this.__target = this.__options.target;
            this.__layout = this.__options.layout;

            if ( options !== marker ) {
                this.__render();
            }

        },

        positionTo: function ( target, layout ) {

            this.__target = target;

            if ( layout ) {
                this.__layout = layout;
            }

        },

        show: function () {

            var docNode = null;

            if ( !this.__target ) {
                return this.callBase();
            }

            docNode = this.__target.ownerDocument.documentElement;

            if ( $.contains( docNode, this.__target ) && $.contains( docNode, this.__element ) ) {
                this.callBase( Utils.getMarker() );
                this.__position();
            }

            return this;

        },

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "ppanel" );

            this.hide();

        },

        // 执行定位
        __position: function () {

            var targetRect = Utils.getRect( this.__target ),
                panelRect = Utils.getRect( this.__element ),
                location = {
                    top: 0,
                    left: 0
                };

            $( this.__element ).addClass( CONF.classPrefix + "ppanel-position" );

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

            $( this.__element ).css( 'top', location.top + 'px' ).css( 'left', location.left + 'px' );

        }

    } );

} );
