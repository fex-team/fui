/**
 * Container类， 所有容器类的父类`
 * @abstract
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        Widget = require( "widget/widget" ),
        Creator = require( "base/creator" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Container", {

        base: Widget,

        constructor: function ( options ) {

            var defaultOptions = {
                column: false,
                widgets: null
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        indexOf: function ( widget ) {

            return $.inArray( widget, this.__widgets );

        },

        disable: function () {

            this.callBase();

            $.each( this.__widgets, function ( index, widget ) {

                widget.disable();

            } );

        },

        enable: function () {

            this.callBase();

            $.each( this.__widgets, function ( index, widget ) {

                widget.enable();

            } );

        },

        getWidgets: function () {

            return this.__widgets;

        },

        getWidget: function ( index ) {

            return this.__widgets[ index ] || null;

        },

        getWidgetByValue: function ( value ) {

            var widget = null;

            $.each( this.__widgets, function ( wgt ) {

                if ( wgt.getValue() === value ) {
                    widget = wgt;
                    return false;
                }

            } );

            return widget;

        },

        appendWidget: function ( widget ) {

            if ( !this.__valid( widget ) ) {
                return null;
            }

            if ( this.__options.disabled ) {
                widget.disable();
            }

            this.__widgets.push( widget );
            widget.appendTo( this.__contentElement );

            if ( this.__options.column ) {
                this.__contentElement.appendChild( $( '<span class="fui-column"></span>' )[0] );
                $( widget.getElement() ).addClass( CONF.classPrefix + "panel-column-widget" );
            }

            return widget;

        },

        appendWidgets: function ( widgetArray ) {

            var _self = this;

            $.each( widgetArray, function ( widget ) {

                _self.appendWidget( widget );

            } );

            return this;

        },

        insertWidget: function ( index, widget ) {

            var oldElement = null;

            if ( this.__widgets.length === 0 ) {
                return this.appendWidget( widget );
            }

            if ( !this.__valid( widget ) ) {
                return null;
            }

            if ( this.__options.disabled ) {
                widget.disable();
            }

            oldElement = this.__widgets[ index ];

            this.__widgets.splice( index, 0, widget );
            this.__contentElement.insertBefore( widget.getElement(), oldElement.getElement() );

            if ( this.__options.column ) {
                this.__contentElement.insertBefore( $( '<span class="fui-column"></span>' )[0], oldElement.getElement() );
                $( widget.getElement() ).addClass( CONF.classPrefix + "panel-column-widget" );
            }

            return widget;

        },

        insertWidgets: function ( index, widgetArray ) {

            var _self = this;

            $.each( widgetArray, function ( widget ) {

                _self.insertWidget( index, widget );
                index++;

            } );

            return this;

        },

        getContentElement: function () {
            return this.__contentElement;
        },

        removeWidget: function ( widget ) {

            if ( typeof widget === "number" ) {
                widget = this.__widgets.splice( widget, 1 );
            } else {
                this.__widgets.splice( this.indexOf( widget ), 1 );
            }

            this.__contentElement.removeChild( widget.getElement() );

            $( widget.getElement() ).removeClass( CONF.classPrefix + "panel-column-widget" );

            return widget;

        },

        __initOptions: function () {

            this.widgetName = 'Container';

            this.__widgets = [];
            this.__contentElement = null;

        },

        __render: function () {

            this.callBase();

            this.__contentElement = this.__element;

            $( this.__element ).addClass( CONF.classPrefix + "container" );

            if ( this.__options.column ) {
                $( this.__element ).addClass( CONF.classPrefix + "container-column" );
            }

            return this;

        },

        // Overload
        __appendChild: function ( childWidget ) {

            return this.appendWidget( childWidget );

        },

        __initWidgets: function () {

            if ( !this.__options.widgets ) {
                return;
            }

            var widgets = Creator.parse( this.__options.widgets ),
                _self = this;


            if ( !$.isArray( widgets ) ) {
                widgets = [ widgets ];
            }

            $.each( widgets, function ( i, widget ) {
                _self.appendWidget( widget );
            } );

        },

        /**
         * 验证元素给定元素是否可以插入当前容器中
         * @param ele 需要验证的元素
         * @returns {boolean} 允许插入返回true, 否则返回false
         * @private
         */
        __valid: function ( ele ) {

            return ele instanceof Widget;

        }

    } );

} );
