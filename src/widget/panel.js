/**
 * 容器类： Panel
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        panelTpl = require( "tpl/panel" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Panel", {

        base: require( "widget/container" ),

        constructor: function ( options ) {

            var defaultOptions = {};

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        __render: function () {

            var $content = null;

            this.callBase();

            $content = $( '<div class="fui-panel-content"></div>' );

            this.__contentElement.appendChild( $content[ 0 ] );

            this.__contentElement = $content[ 0 ];

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Panel';
            this.__tpl = panelTpl;

        }

    } );

} );
