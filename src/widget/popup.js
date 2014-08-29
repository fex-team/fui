/**
 * 容器类： PPanel = Positioning Panel
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        Widget = require( "widget/widget" ),
        Mask = require( "widget/mask" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Popup", {

        base: require( "widget/ppanel" ),

        constructor: function ( options ) {

            var defaultOptions = {
                mask: {}
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        open: function () {

            this.__fire( "open", function () {

                this.show();

            } );

            return this;
        },

        close: function () {

            this.__fire( "close", function () {

                this.hide();

            } );

            return this;
        },

        show: function () {

            if ( !this.__target ) {
                this.__target = this.__element.ownerDocument.body;
            }

            if ( !this.__inDoc ) {
                this.__inDoc = true;
                this.appendTo( this.__element.ownerDocument.body );
            }

            this.__maskWidget.show();
            this.callBase();

            this.__openState = true;

            return this;

        },

        hide: function () {

            this.callBase();
            this.__maskWidget.hide();

            this.__openState = false;

            return this;

        },

        toggle: function () {

            this.isOpen() ? this.close() : this.open();

            return this;

        },

        isOpen: function () {
            return this.__openState;
        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Popup';

            this.__target = this.__options.target;
            this.__layout = this.__options.layout;
            this.__inDoc = false;
            this.__openState = false;

            this.__maskWidget = null;

            if ( this.__target instanceof Widget ) {
                this.__target = this.__target.getElement();
            }

        },

        __render: function () {

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "popup" );

            this.__maskWidget = new Mask( this.__options.mask );

            if ( this.__options.draggable ) {
                this.__initDraggable();
            }

            this.__initMaskEvent();

        },

        __initMaskEvent: function () {

            var _self = this;

            this.__maskWidget.on( "click", function () {
                _self.close();
            } );

        }

    } );

} );
