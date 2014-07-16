/**
 * Button对象
 * 通用按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        tpl = require( "tpl/button-menu" ),
        Button = require( "widget/button" ),
        Menu = require( "widget/menu" ),
        Mask = require( "widget/mask" ),
        Utils = require( "base/utils" ),
        LAYOUT = CONF.layout;

    return require( "base/utils" ).createClass( "ButtonMenu", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                // item选项
                menu: null,
                mask: null,
                buttons: [],
                selected: -1,
                layout: LAYOUT.RIGHT
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'ButtonMenu';
            this.__tpl = tpl;

            this.__buttonWidgets = null;
            this.__menuWidget = null;
            this.__maskWidget = null;
            this.__openState = false;

            if ( options !== marker ) {
                this.__render();
            }

        },

        open: function () {
            this.__openState = true;
            this.__maskWidget.show();
            this.__menuWidget.show();
            this.addClass( CONF.classPrefix + "button-active" );
        },

        close: function () {
            this.__openState = false;
            this.__maskWidget.hide();
            this.__menuWidget.hide();
            this.removeClass( CONF.classPrefix + "button-active" );
        },

        isOpen: function () {
            return !!this.__openState;
        },

        getSelected: function () {
            return this.__menuWidget.getSelected();
        },

        getSelectedItem: function () {
            return this.__menuWidget.getSelectedItem();
        },

        getValue: function () {
            return this.getSelectedItem().getValue();
        },

        __render: function () {

            var _self = this;

            if ( this.__rendered ) {
                return this;
            }

            this.__initOptions();

            this.callBase();

            this.__initButtons();

            this.__menuWidget = new Menu( this.__options.menu );
            this.__maskWidget = new Mask( this.__options.mask );

            this.__menuWidget.positionTo( this.__element );
            this.__menuWidget.appendTo( this.__element.ownerDocument.body );

            this.__initButtonMenuEvent();

        },

        __initOptions: function () {

            if ( this.__options.selected !== -1 ) {
                this.__options.menu.selected = this.__options.selected;
            }

        },

        __initButtons: function () {

            var buttons = [],
                ele = this.__element,
                btn = null,
                lastIndex = this.__options.buttons.length - 1;

            if ( this.__options.layout === LAYOUT.TOP || this.__options.layout === LAYOUT.LEFT ) {
                btn = new Button( this.__options.buttons[ lastIndex ] );
                btn.appendTo( ele );
            } else {
                lastIndex = -1;
            }

            $.each( this.__options.buttons, function ( index, options ) {

                if ( lastIndex !== index ) {

                    var button = new Button( options );
                    button.appendTo( ele );

                    buttons.push( button );

                } else {

                    buttons.push( btn );

                }

            } );

            this.addClass( CONF.classPrefix + "layout-" + this.__options.layout );
            buttons[ buttons.length - 1 ].addClass( CONF.classPrefix + "open-btn" );

            this.__buttonWidgets = buttons;

        },

        __initButtonMenuEvent: function () {

            var lastBtn = this.__buttonWidgets[ this.__buttonWidgets.length - 1 ],
                _self = this;

            lastBtn.on( "click", function ( e ) {

                _self.open();

            } );

            this.__maskWidget.on( "maskclick", function () {

                _self.close();

            } );

            this.__menuWidget.on( "select", function ( e, info ) {

                e.stopPropagation();

                _self.close();
                _self.trigger( "select", info );

            } ).on( "change", function ( e, info ) {

                _self.trigger( "change", info );

            } );

            this.on( "btnclick", function ( e ) {

                e.stopPropagation();

                var btnIndex = $.inArray( e.widget, this.__buttonWidgets );

                if ( btnIndex > -1 && btnIndex < this.__buttonWidgets.length - 1 ) {
                    this.trigger( "buttonclick", {
                        button: this.__buttonWidgets[ btnIndex ]
                    } );
                }

            } );

        }

    } );

} );