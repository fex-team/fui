/*jshint camelcase:false*/
/**
* Input widget
*/

define( function ( require ) {

    var CONF = require( "base/sysconf" ),
        $ = require( "base/jquery" ),
        tpl = require( 'tpl/input' );

    return require( "base/utils" ).createClass( "Input", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                placeholder: null
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        getValue: function () {
            return this.__element.value;
        },

        setValue: function ( value ) {
            this.__element.value = value;
            return this;
        },

        disable: function () {
            this.callBase();
            this.__element.disabled = true;
        },

        enable: function () {
            this.__element.disabled = false;
            this.callBase();
        },

        reset: function () {
            this.__element.value = this.__options.value || "";
            return this;
        },

        selectAll: function () {
            this.__element.select();
        },

        selectRange: function ( startIndex, endIndex ) {

            if ( !startIndex ) {
                startIndex = 0;
            }

            if ( !endIndex ) {
                endIndex = 1000000000;
            }

            this.__element.setSelectionRange( startIndex, endIndex );

        },

        focus: function () {

            this.__element.focus();
            return this;

        },

        unfocus: function () {

            this.__element.blur();
            return this;

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Input';
            this.__tpl = tpl;
            // input构件允许获得焦点
            this.__allow_focus = true;

        },

        __render: function () {

            this.callBase();

            this.__element.removeAttribute( "unselectable" );

            if ( this.__options.placeholder ) {
                this.__element.setAttribute( "placeholder", this.__options.placeholder );
            }

            this.addClass( CONF.classPrefix + "selectable" );

        },

        __initEvent: function () {

            this.callBase();

            this.on( "keydown", function ( e ) {

                if ( e.keyCode === 13 ) {
                    this.trigger( "inputcomplete", {
                        value: this.getValue()
                    } );
                }

            } );

        }

    } );

} );