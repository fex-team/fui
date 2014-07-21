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
                textAlign: 'center'
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Label';
            this.__tpl = labelTpl;

            if ( options !== marker ) {
                this.__render();
            }

        },

        getValue: function () {
            return this.__options.text;
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

        // label 禁用title显示
        __allowShowTitle: function () {
            return false;
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

            this.__options.text = this.__options.text.toString();

        }

    } );
} );
