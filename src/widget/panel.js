/**
 * 容器类： Panel
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        panelTpl = require( "tpl/panel" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Panel", {

        base: require( "widget/container" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {};

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Panel';

            this.__tpl = panelTpl;

            if ( options !== marker ) {
                this.__render();
                this.__initWidgets();
            }

        },

        __render: function () {

            var $content = null;

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            $content = $( '<div class="fui-panel-content"></div>' );

            this.__contentElement.appendChild( $content[ 0 ] );

            this.__contentElement = $content[ 0 ];

        }

    } );

} );
