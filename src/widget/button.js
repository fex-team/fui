/**
 * Button对象
 * 通用按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        buttonTpl = require( "tpl/button" ),
        Icon = require( "widget/icon" ),
        Label = require( "widget/label" ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "Button", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                label: null,
                text: null,
                icon: null,
                width: null,
                height: null,
                padding: 2,
                // label相对icon的位置
                layout: 'right'
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Button';
            this.__tpl = buttonTpl;

            this.__iconWidget = null;
            this.__labelWidget = null;

            if ( options !== marker ) {
                this.__render();
            }

        },

        getLabel: function () {
            return this.__labelWidget.getText();
        },

        setLabel: function ( text ) {

            return this.__labelWidget.setText( text );

        },

        __render: function () {

            var _self = this;

            if ( this.__rendered ) {
                return this;
            }

            this.__initOptions();
            this.callBase();

            this.__iconWidget = new Icon( this.__options.icon );
            this.__labelWidget = new Label( this.__options.label );

            // layout
            switch ( this.__options.layout ) {

                case 'left':
                case 'top':
                    this.__element.appendChild( this.__labelWidget.getElement() );
                    this.__element.appendChild( this.__iconWidget.getElement() );
                    break;

                case 'right':
                case 'bottom':
                default:
                    this.__element.appendChild( this.__iconWidget.getElement() );
                    this.__element.appendChild( this.__labelWidget.getElement() );
                    break;

            }

            $( this.__element ).addClass( CONF.classPrefix + "button-layout-"+this.__options.layout )

        },

        __initOptions: function () {

            this.__options.__css = Utils.getCssRules( [ 'width', 'height', 'padding' ], this.__options );

            if ( typeof this.__options.label === "string" ) {
                this.__options.label = {
                    text: this.__options.label
                };
            }

            if ( typeof this.__options.icon === "string" ) {
                this.__options.icon = {
                    img: this.__options.icon
                }
            }

        }

    } );

} );