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

        getValue: function () {
            return this.__labelWidget.getValue() || this.__iconWidget.getValue() || null;
        },

        select: function () {

            this.__update( true );

            return this;

        },

        unselect: function () {

            this.__update( false );

            return this;

        },

        isSelected: function () {
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

            this.__initItemEvent();

        },

        __update: function ( state ) {

            state = !!state;

            $( this.__element )[ state ? "addClass" : "removeClass" ]( CONF.classPrefix + "item-selected" );
            this.__selectState = state;

            this.trigger( state ? "itemselect" : "itemunselect" );

            return this;

        },

        __initItemEvent: function () {

            this.on( "click", function () {

                this.trigger( "itemclick" );

            } );

        },

        /**
         * 初始化模板所用的css值
         * @private
         */
        __initOptions: function () {

            if ( typeof this.__options.label !== "object" ) {
                this.__options.label = {
                    text: this.__options.label
                };
            }

            if ( !this.__options.label.textAlign ) {
                this.__options.label.textAlign = this.__options.textAlign;
            }

            if ( typeof this.__options.icon !== "object" ) {
                this.__options.icon = {
                    img: this.__options.icon
                };
            }

        }

    } );
} );
