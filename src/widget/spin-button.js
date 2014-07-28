/**
 * SpinButton对象
 * 数值按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        tpl = require( "tpl/spin-button" ),
        Button = require( "widget/button" ),
        Input = require( "widget/input" ),
        Panel = require( "widget/panel" ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "SpinButton", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                suffix: null,
                selected: -1,
                items: []
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        getValue: function () {
            return this.__options.items[ this.__currentSelected ] || null;
        },

        // Overload
        setValue: function ( value ) {},

        select: function ( index ) {
            this.__update( index );
        },

        // 根据值进行选择
        selectByValue: function ( value ) {
            value = value + "";
            this.__update( $.inArray( value, this.__options.items ) );
        },

        __render: function () {

            this.callBase();

            this.__buttons = [
                new Button( {
                    className: CONF.classPrefix + 'spin-up-btn'
                } ),
                new Button( {
                    className: CONF.classPrefix + 'spin-down-btn'
                } )
            ];

            this.__inputWidget = new Input();
            this.__panelWidget = new Panel( {
                column: true
            } );

            this.__inputWidget.appendTo( this.__element );
            this.__panelWidget.appendWidget( this.__buttons[ 0 ] );
            this.__panelWidget.appendWidget( this.__buttons[ 1 ] );
            this.__panelWidget.appendTo( this.__element );

            this.__initSelected( this.__options.selected );

        },

        __initEvent: function () {

            var _self = this;

            this.callBase();

            this.__buttons[ 0 ].on( "btnclick", function () {

                _self.__update( _self.__currentSelected - 1 );

            } );

            this.__buttons[ 1 ].on( "btnclick", function () {

                _self.__update( _self.__currentSelected + 1 );

            } );

        },

        __initSelected: function ( index ) {

            this.__update( index, false );

        },

        __update: function ( index, isTrigger ) {

            var oldIndex = -1,
                toValue = null;

            if ( index < 0 || index >= this.__options.items.length ) {
                return;
            }

            oldIndex = this.__currentSelected;
            this.__currentSelected = index;

            toValue = this.__options.items[ this.__currentSelected ];

            this.__inputWidget.setValue( toValue + ' ' + ( this.__options.suffix || '' ) );

            if ( isTrigger !== false ) {

                this.trigger( "change", {
                    from: this.__options.items[ oldIndex ] || null,
                    to: toValue
                } );

            }

        },

        __initOptions: function () {

            var items = this.__options.items;

            this.callBase();

            this.widgetName = 'SpinButton';
            this.__tpl = tpl;

            this.__buttons = [];
            this.__panelWidget = null;
            this.__inputWidget = null;
            this.__currentSelected = -1;

            $.each( items, function ( index, val ) {

                items[ index ] = val + '';

            } );

        }

    } );

} );