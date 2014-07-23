/**
 * InputButton对象
 * 可接受输入的按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        tpl = require( "tpl/input-button" ),
        Button = require( "widget/button" ),
        Input = require( "widget/input" ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "InputButton", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                button: null,
                input: null,
                placeholder: null,
                // label相对icon的位置
                layout: 'right'
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'InputButton';
            this.__tpl = tpl;

            this.__inputWidget = null;
            this.__buttonWidget = null;

            if ( options !== marker ) {
                this.__render();
            }

        },

        getValue: function () {
            return this.__inputWidget.getValue();
        },

        setValue: function ( value ) {

            this.__inputWidget.setValue( value );

            return this;

        },

        selectAll: function () {

            this.__inputWidget.selectAll();

            return this;

        },

        selectRange: function ( start, end ) {

            this.__inputWidget.selectRange( start, end );

            return this;

        },

        focus: function () {

            this.__inputWidget.focus();
            return this;

        },

        unfocus: function () {

            this.__inputWidget.unfocus();
            return this;

        },

        __render: function () {

            var _self = this;

            if ( this.__rendered ) {
                return this;
            }

            this.__initOptions();

            this.callBase();

            this.__buttonWidget = new Button( this.__options.button );
            this.__inputWidget = new Input( this.__options.input );

            // layout
            switch ( this.__options.layout ) {

                case 'left':
                case 'top':
                    this.__buttonWidget.appendTo( this.__element );
                    this.__inputWidget.appendTo( this.__element );
                    break;

                case 'right':
                case 'bottom':
                default:
                    this.__inputWidget.appendTo( this.__element );
                    this.__buttonWidget.appendTo( this.__element );
                    break;

            }

            $( this.__element ).addClass( CONF.classPrefix + "layout-"+this.__options.layout )

            this.__buttonWidget.on( "click", function () {
                _self.trigger( "buttonclick" );
            } );

        },

        __initOptions: function () {

            if ( typeof this.__options.input !== "object" ) {
                this.__options.input = {
                    placeholder: this.__options.input
                }
            }

            this.__options.input = $.extend( {}, this.__options.input, {
                placeholder: this.__options.placeholder
            } );

            if ( typeof this.__options.button !== "object" ) {
                this.__options.button = {
                    icon: this.__options.button
                }
            }

        }

    } );

} );