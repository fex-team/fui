/**
 * icon widget
 * 封装多种icon方式
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        iconTpl = require( 'tpl/icon' );

    return require( "base/utils" ).createClass( "Icon", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                img: null
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        getValue: function () {
            return this.__options.value || this.__options.img;
        },

        setImage: function ( imageSrc ) {

            if ( this.__options.img === imageSrc ) {
                return this;
            }

            if ( this.__image ) {
                this.__image.src = imageSrc;
            }

            this.trigger( "iconchange", {
                prevImage: this.__prevIcon,
                currentImage: this.__currentIcon
            } );

        },

        getImage: function () {
            return this.__currentIcon;
        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Icon';
            this.__tpl = iconTpl;
            this.__prevIcon = null;
            this.__currentIcon = this.__options.img;

            this.__image = null;

        },

        __render: function () {

            this.__options.__width = this.__options.width;
            this.__options.__height = this.__options.height;

            this.__options.width = null;
            this.__options.height = null;

            this.callBase();

            if ( !this.__options.img ) {
                return;
            }

            this.__image = $( "img", this.__element )[ 0 ];

            if ( this.__options.__width !== null ) {
                this.__image.width = this.__options.__width;
            }

            if ( this.__options.__height !== null ) {
                this.__image.height = this.__options.__height;
            }

        }

    } );

} );