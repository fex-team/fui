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

            var defaultOptions = {
                button: null,
                panel: null,
                width: null,
                height: null
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        disable: function () {

            this.callBase();

        },

        enable: function () {

            this.callBase();

        },

        open: function (){

            this.__popupWidget.appendWidget(this.__panelWidget);
            this.__maskWidget.show();
            this.__popupWidget.show();

            var $popup = $(this.__popupWidget.getElement());
            $popup.css('top', parseInt($popup.css('top')) - $(this.__element).outerHeight());
            $popup.css('min-width', $(this.__element).outerWidth());
            $popup.css('min-height', $(this.__element).height());
        },

        close: function (){

            this.__maskWidget.hide();
            this.__popupWidget.hide();
            this.__panelWidget.appendTo(this.__contentElement);

        },

        getPanelElement: function() {
            return this.__panelWidget.getElement();
        },

        appendWidget: function (widget){

            this.__panelWidget.appendWidget(widget);

        },

        getWidgets: function () {
            return this.__panelWidget.getWidgets();
        },

        getWidget: function ( index ) {
            return this.__panelWidget.getWidget( index );
        },

        appendWidgets: function ( widgets ) {
            this.__panelWidget.appendWidgets.apply( this, arguments );
            return this;
        },

        insertWidget: function ( index, widget ) {
            this.__panelWidget.insertWidget( index, widget );
        },

        insertWidgets: function ( index, widgets ) {
            this.__panelWidget.insertWidgets.call( this, arguments );
            return this;
        },

        removeWidget: function ( widget ) {
            return this.__panelWidget.removeWidget( widget );
        },
        
        __render: function () {

            this.__initOptions();

            this.__buttonWidget = new Button( this.__options.button );
            this.__panelWidget = new Panel( this.__options.content );
            this.__popupWidget = new PPanel();
            this.__maskWidget = new Mask( this.__options.mask );

            this.callBase();

            this.__popupWidget.positionTo(this.__element);
            $(this.__popupWidget.getElement()).addClass(CONF.classPrefix + 'drop-panel-popup');

            // 初始化content
            var $content = $('<div class="' + CONF.classPrefix + 'drop-panel-content"></div>').append(this.__panelWidget.getElement());
            this.__contentElement = $content[0];

            // 插入按钮到element
            $(this.__element).append($content).append(this.__buttonWidget.getElement());
            this.__initDropPanelEvent();

        },

        __initOptions: function () {

            this.widgetName = 'DropPanel';
            this.__tpl = tpl;

            this.__buttonWidget = null;
            this.__popupWidget = null;
            this.__panelWidget = null;
            this.__contentElement = null;
            this.__maskWidget = null;
            this.__popupState = false;

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