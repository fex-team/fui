/**
 * 容器类： PPanel = Positioning Panel
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        Widget = require( "widget/widget" ),
        Mask = require( "widget/mask" ),
        tpl = require( "tpl/dialog" ),
        Button = require( "widget/button" ),
        LAYOUT = CONF.layout,
        $ = require( "base/jquery" );

    return Utils.createClass( "Dialog", {

        base: require( "widget/ppanel" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                layout: LAYOUT.CENTER,
                caption: null,
                resize: 'height',
                draggable: true,
                // 是否包含close button
                closeButton: true,
                mask: {
                    color: '#000',
                    opacity: 0.2
                }
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Dialog';

            this.__target = this.__options.target;
            this.__layout = this.__options.layout;
            this.__inDoc = false;
            this.__hinting = false;
            this.__openState = false;

            this.__headElement = null;
            this.__bodyElement = null;
            this.__footElement = null;
            this.__maskWidget = null;

            if ( this.__target instanceof Widget ) {
                this.__target = this.__target.getElement();
            }

            if ( options !== marker ) {
                this.__render();
            }

        },

        open: function () {
            return this.show();
        },

        close: function () {
            return this.hide();
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

        getHeadElement: function () {
            return this.__headElement;
        },

        getBodyElement: function () {
            return this.getContentElement();
        },

        getFootElement: function () {
            return this.__footElement;
        },

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            this.__innerTpl = Utils.Tpl.compile( tpl, this.__options );

            this.__contentElement.appendChild( $( this.__innerTpl )[ 0 ] );

            $( this.__element ).addClass( CONF.classPrefix + "dialog" );

            this.__headElement = $( ".fui-dialog-head", this.__contentElement )[ 0 ];
            this.__bodyElement = $( ".fui-dialog-body", this.__contentElement )[ 0 ];
            this.__footElement = $( ".fui-dialog-foot", this.__contentElement )[ 0 ];

            this.__maskWidget = new Mask( this.__options.mask );

            this.__contentElement = this.__bodyElement;

            if ( this.__options.draggable ) {
                this.__initDraggable();
            }

            if ( this.__options.closeButton ) {
                this.__initCloseButton();
            }

            this.__initMaskLint();

        },

        __initDraggable: function () {

            Utils.createDraggable( {
                handler: this.__headElement,
                target: this.__element
            } ).bind();

        },

        __initCloseButton: function () {

            var _self = this,
                closeButton = new Button( {
                    className: 'fui-close-button',
                    icon: {
                        className: 'fui-close-button-icon'
                    }
                } );

            closeButton.on( "mousedown", function ( e ) {

                e.stopPropagation();

            } );

            closeButton.on( "click", function ( e ) {

                e.stopPropagation();

                _self.close();

            } );

            closeButton.appendTo( this.__headElement );

        },

        __initMaskLint: function () {

            var _self = this;

            this.__maskWidget.on( "click", function () {
                _self.__hint();
            } );

        },

        __hint: function () {

            if ( this.__hinting ) {
                return;
            }

            this.__hinting = true;

            var $ele = $( this.__element ),
                _self = this,
                classNmae = [ CONF.classPrefix + "mask-hint", CONF.classPrefix + "mask-animate" ];

            $ele.addClass( classNmae.join( " " ) );

            window.setTimeout( function () {
                $ele.removeClass( classNmae[ 0 ] );
                window.setTimeout( function () {
                    $ele.removeClass( classNmae[ 1 ] );
                    _self.__hinting = false;
                }, 200 );
            }, 200 );

        }

    } );

} );
