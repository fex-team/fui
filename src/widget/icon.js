/**
 * icon widget
 * 封装多种icon方式
 */

define( function ( require ) {

    var prefix = '_fui_',
        $ = require( "base/jquery" ),
        iconTpl = require( 'tpl/icon' ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "Icon", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                width: null,
                height: null,
                img: null
            };


            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Icon';
            this.__tpl = iconTpl;

            if ( options !== marker ) {
                this.__render();
            }

        },

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.__initOptions();
            this.callBase();

        },

        __initOptions: function () {

            this.__options.__css = Utils.getCssRules( [ 'width', 'height' ], this.__options );

        }

    } );

} );