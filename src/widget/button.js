/**
 * Button对象
 * 通用按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        buttonTpl = require( "tpl/button" ),
        Icon = require( "widget/icon" ),
        Label = require( "widget/label" );

    return require( "base/utils" ).createClass( "Button", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                label: null,
                text: null,
                icon: null,
                // label相对icon的位置
                layout: 'right'
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        getLabel: function () {
            return this.__labelWidget.getText();
        },

        setLabel: function ( text ) {
            return this.__labelWidget.setText( text );
        },

        getLabelWidget: function() {
            return this.__labelWidget;
        },

        getIconWidget: function() {
            return this.__iconWidget;
        },

        __render: function () {

            this.callBase();

            this.__iconWidget = new Icon( this.__options.icon );
            this.__labelWidget = new Label( this.__options.label );

            // layout
            switch ( this.__options.layout ) {

                case 'left':
                /* falls through */
                case 'top':
                    this.__element.appendChild( this.__labelWidget.getElement() );
                    this.__element.appendChild( this.__iconWidget.getElement() );
                    break;

                case 'right':
                /* falls through */
                case 'bottom':
                /* falls through */
                default:
                    this.__element.appendChild( this.__iconWidget.getElement() );
                    this.__element.appendChild( this.__labelWidget.getElement() );
                    break;

            }

            $( this.__element ).addClass( CONF.classPrefix + "button-layout-"+this.__options.layout );

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Button';
            this.__tpl = buttonTpl;

            this.__iconWidget = null;
            this.__labelWidget = null;

            if ( typeof this.__options.label !== "object" ) {
                this.__options.label = {
                    text: this.__options.label
                };
            }

            if ( typeof this.__options.icon !== "object" ) {
                this.__options.icon = {
                    img: this.__options.icon
                };
            }

        },

        __initEvent: function () {

            this.callBase();

            this.on( "click", function () {

                this.__trigger( "btnclick" );

            } );

        }

    } );

} );