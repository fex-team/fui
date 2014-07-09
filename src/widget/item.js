/**
 * Label Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        itemTpl = require( "tpl/item" ),
        Icon = require( "widget/icon" ),
        Label = require( "widget/label" ),
        CONF = require( "base/sysconf" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Item", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                label: '',
                icon: null,
                width: null,
                height: null,
                padding: null,
                selected: false,
                textAlign: 'left'
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Item';
            this.__tpl = itemTpl;

            this.__iconWidget = null;
            this.__labelWidget = null;
            this.__selectState = this.__options.selected;

            if ( options !== marker ) {
                this.__render();
            }

        },

        select: function () {

            this.__update( true );

            return this;

        },

        unselect: function () {

            this.__update( false );

            return this;

        },

        isSelect: function () {
            return this.__selectState;
        },

        setLabel: function ( text ) {

            this.__labelWidget.setText( text );
            return this;

        },

        getLabel: function () {
            return this.__labelWidget.getText();
        },

        setIcon: function ( imageSrc ) {

            this.__iconWidget.setImage( imageSrc );
            return this;

        },

        getIcon: function () {
            return this.__iconWidget.getImage();
        },

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.__initOptions();

            this.callBase();

            this.__iconWidget = new Icon( this.__options.icon );
            this.__labelWidget = new Label( this.__options.label );

            this.__iconWidget.appendTo( this.__element );
            this.__labelWidget.appendTo( this.__element );

            this.__initEvent();

        },

        __update: function ( state ) {

            state = !!state;

            $( this.__element )[ state ? "addClass" : "removeClass" ]( CONF.classPrefix + "item-selected" );
            this.__selectState = state;

            this.trigger( state ? "itemselect" : "itemunselect" );

            return this;

        },

        __initEvent: function () {

            this.callBase();

            this.on( "click", function () {

                this.trigger( "itemclick" );

            } );

        },

        /**
         * 初始化模板所用的css值
         * @private
         */
        __initOptions: function () {

            this.__options.__css = Utils.getCssRules( [ 'width', 'height', 'padding', {
                textAlign: 'text-align'
            } ], this.__options );

            if ( typeof this.__options.label === "string" ) {
                this.__options.label = {
                    text: this.__options.label
                };
            }

            if ( typeof this.__options.icon === "string" ) {
                this.__options.icon = {
                    img: this.__options.icon
                };
            }

        }

    } );
} );
