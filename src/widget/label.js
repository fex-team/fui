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

            var defaultOptions = {
                text: '',
                textAlign: 'center'
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

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

        /**
         * 初始化模板所用的css值
         * @private
         */
        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Label';
            this.__tpl = labelTpl;

            this.__options.text = this.__options.text.toString();

        }

    } );
} );
