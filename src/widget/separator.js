/**
 * Separator(分隔符) Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Separator", {

        base: require( "widget/widget" ),

        __tpl: require( "tpl/separator" ),

        __events: [],

        __defaultOptions: {
            padding: null,
            margin: null,
            width: 1,
            height: '100%',
            color: '#e1e1e1'
        },

        widgetName: 'Separator',

        constructor: function () {

            this.__initOptions();

        },

        /**
         * 初始化模板所用的css值
         * @private
         */
        __initOptions: function () {

            var cssMapping = {},
                options = this.__options,
                value = null;

            $.each( [ 'width', 'height', 'padding', 'margin', 'color' ], function ( i, item ) {

                value = options[ item ];

                if ( item === "color" ) {
                    item = 'background-color';
                }

                if ( value !== null && value !== undefined ) {
                    cssMapping[ item ] = value;
                }

            } );

            options.__css = cssMapping;

        }

    } );
} );
