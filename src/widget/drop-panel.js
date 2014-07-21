/**
 * DropPanel对象
 * 可接受输入的按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        tpl = require( "tpl/drop-panel" ),
        Button = require( "widget/button" ),
        Panel = require( "widget/panel" ),
        PPanel = require( "widget/ppanel" ),
        Mask = require( "widget/mask" ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "DropPanel", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                button: null,
                panel: null,
                width: null,
                height: null
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'DropPanel';
            this.__tpl = tpl;

            this.__buttonWidget = null;
            this.__popupWidget = null;
            this.__panelWidget = null;
            this.__contentElement = null;
            this.__maskWidget = null;
            this.__popupState = false;

            if ( options !== marker ) {
                this.__render();
            }

        },

        disable: function () {

            this.callBase();
            this.__labelWidget.disable();

        },

        enable: function () {

            this.callBase();
            this.__labelWidget.enable();

        },

        open: function (){

            this.__popupWidget.appendWidget(this.__panelWidget);
            this.__maskWidget.show();
            this.__popupWidget.show();

            var $popup = $(this.__popupWidget.getElement());
            $popup.css('top', parseInt($popup.css('top')) - $(this.__element).height() - 1);

//            var $root = $(this.__element);
//            var $panel = $(this.__panelWidget.getElement());
//            var rootWidth = $root.width();
//
//            $panel.width(rootWidth);
//            //$root.addClass(CONF.classPrefix + 'drop-panel-open');
//
//            this.trigger( "open" );
//            this.__isOpen = true;

        },

        close: function (){

            this.__maskWidget.hide();
            this.__popupWidget.hide();
            this.__panelWidget.appendTo(this.__contentElement);


//            if (this.__isOpen) {
//                var $root = $(this.__element);
//                var $panel = $(this.__panelWidget.getElement());
//                var $place = $(this.__placeholderElement);
//                var placeWidth = $place.width();
//
//                $root.removeClass(CONF.classPrefix + 'drop-panel-open');
//                $panel.width(placeWidth);
//
//                this.trigger( "close" );
//            }
//            this.__isOpen = false;

        },

        appendWidget: function (widget){

            this.__panelWidget.appendWidget(widget);

        },

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.__initOptions();

            this.__buttonWidget = new Button( this.__options.button );
            this.__panelWidget = new Panel( this.__options.content );
            this.__popupWidget = new PPanel();
            this.__maskWidget = new Mask( this.__options.mask );

            this.callBase();

            this.__popupWidget.positionTo(this.__element);
            $(this.__popupWidget.getElement()).addClass(CONF.classPrefix + 'drop-panel-popup');

            // 初始化content
            $content = $('<div class="' + CONF.classPrefix + 'drop-panel-content"></div>').append(this.__panelWidget.getElement());
            this.__contentElement = $content[0];

            // 插入按钮到element
            $(this.__element).append($content).append(this.__buttonWidget.getElement());
            this.__initDropPanelEvent();

        },

        __initOptions: function () {

            if ( typeof this.__options.button !== "object" ) {
                this.__options.input = {
                    icon: this.__options.button
                };
            }

        },
        __initDropPanelEvent: function (){

            var _self = this;
            this.__buttonWidget.on( "click", function () {
                if ( !_self.__popupState ) {
                    _self.__appendPopup();
                    _self.__popupState = true;
                }
                _self.trigger( "buttonclick" );
                _self.open();
            });
            this.__panelWidget.on( "click", function () {
                _self.trigger( "panelclick" );
            });

            // mask 点击关闭
            this.__maskWidget.on( "maskclick", function () {
                _self.close();
            } );
        },
        __appendPopup: function (){

            this.__popupWidget.appendTo( this.__element.ownerDocument.body );

        }

    } );

} );