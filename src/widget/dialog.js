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
        $ = require( "base/jquery" ),
        ACTION = {
            CANCEL: 'cancel',
            OK: 'ok'
        };

    return Utils.createClass( "Dialog", {

        base: require( "widget/ppanel" ),

        constructor: function ( options ) {

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
                },
                // 底部按钮
                buttons: [ {
                    className: CONF.classPrefix + 'xdialog-ok-btn',
                    action: 'ok',
                    label: '确定'
                }, {
                    className: CONF.classPrefix + 'xdialog-cancel-btn',
                    action: 'cancel',
                    label: '取消'
                } ]
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

        getButtons: function () {
            return this.__buttons;
        },

        getButton: function ( index ) {
            return this.__buttons[ index ];
        },

        appendTo: function ( container ) {

            this.callBase( container );
            this.__maskWidget.appendTo( container );
            this.__inDoc = true;

            return this;

        },

        show: function () {

            if ( !this.__target ) {
                this.__target = this.__element.ownerDocument.body;
            }

            if ( !this.__inDoc ) {
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

        __initOptions: function () {

            this.callBase();

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

            this.__buttons = [];

            if ( this.__target instanceof Widget ) {
                this.__target = this.__target.getElement();
            }

        },

        __render: function () {

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

            this.__initButtons();

            this.__initMaskLint();

        },

        __action: function ( type, btn ) {

            switch ( type ) {

                case ACTION.OK:
                    if ( this.__triggerHandler( type ) !== false ) {
                        this.close();
                    }
                    break;

                case ACTION.CANCEL:
                    this.__triggerHandler( type );
                    this.close();
                    break;

            }

        },

        __initButtons: function () {

            var _self = this,
                button = null,
                foot = this.__footElement;

            $.each( this.__options.buttons, function ( index, buttonOption ) {

                button = new Button( buttonOption );
                button.appendTo( foot );
                _self.__buttons.push( button );

            } );

        },

        __initEvent: function () {

            var _self = this;

            this.callBase();

            $( [ this.__footElement, this.__headElement ] ).on( "btnclick", function ( e, btn ) {

                _self.__action( btn.getOptions().action, btn );

            } );

        },

        __initDraggable: function () {

            Utils.createDraggable( {
                handler: this.__headElement,
                target: this.__element
            } ).bind();

        },

        __initCloseButton: function () {

            var closeButton = new Button( {
                className: 'fui-close-button',
                action: 'cancel',
                icon: {
                    className: 'fui-close-button-icon'
                }
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
