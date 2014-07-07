/**
 * 容器类： Panel
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Panel", {

        base: require( "widget/container" ),

        __defaultOptions: {
            width: null,
            height: null,
            padding: null,
            margin: 0
        },

        __tpl: require( "tpl/panel" ),

        widgetName: 'Panel',

        constructor: function ( options ) {

            this.__initOptions();

        },

        appendWidget: function ( widget ) {

            var returnValue = this.callBase( widget );

            if ( this.__options.margin ) {
                widget.getElement().style.margin = this.__options.margin;
            }

            return returnValue;

        },

        insertWidget: function ( index, widget ) {

            var returnValue = this.callBase( index, widget );

            if ( this.__options.margin ) {
                widget.getElement().style.margin = this.__options.margin;
            }

            return returnValue;

        },

        __initOptions: function () {

            var cssMapping = {},
                options = this.__options,
                value = null;

            $.each( [ 'width', 'height', 'padding' ], function ( i, item ) {

                value = options[ item ];

                if ( value !== null && value !== undefined ) {
                    cssMapping[ item ] = value;
                }

            } );

            options.__css = cssMapping;

        }

    } );

} );
