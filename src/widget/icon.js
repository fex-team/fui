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
            this.__prevIcon = null;
            this.__currentIcon = this.__options.img;

            if ( options !== marker ) {
                this.__render();
            }

        },

        setImage: function ( imageSrc ) {

            var tpl = null,
                node = null;

            if ( this.__options.img === imageSrc ) {
                return this;
            }

            this.__prevIcon = this.__currentIcon;
            this.__currentIcon = imageSrc;

            tpl = Utils.Tpl.compile( this.__tpl, $.extend( {}, this.__options, {
                img: this.__currentIcon
            } ) );

            node = $( tpl )[ 0 ];

            this.__element.innerHTML = node.innerHTML;
            node = null;

            this.trigger( "iconchange", {
                prevImage: this.__prevIcon,
                currentImage: this.__currentIcon
            } );

        },

        getImage: function () {
            return this.__currentIcon;
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