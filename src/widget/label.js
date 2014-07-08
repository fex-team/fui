/**
 * Label Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        labelTpl = require( "tpl/label" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Label", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                text: '',
                width: null,
                height: null,
                padding: null,
                textAlign: 'center'
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Label';
            this.__tpl = labelTpl;

            if ( options !== marker ) {
                this.__render();
            }

        },

        setText: function ( text ) {

            var oldtext = this.__options.text;

            this.__options.text = text;
            $( this.__element ).text( text );

            this.trigger( "labelchange", {
                currentText: text,
                prevText: oldtext
            } );

            return this;

        },

        getText: function () {
            return this.__options.text;
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

            this.__options.__css = Utils.getCssRules( [ 'width', 'height', 'padding', {
                textAlign: 'text-align'
            } ], this.__options );

        }

    } );
} );
