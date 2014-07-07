/**
 * Separator(分隔符) Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        separatorTpl = require( "tpl/separator" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Separator", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                padding: null,
                margin: null,
                width: 1,
                height: '100%',
                color: '#e1e1e1'
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Separator';
            this.__tpl = separatorTpl;

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
