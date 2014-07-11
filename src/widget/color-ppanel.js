/**
 * Menu Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        ColorPicker = require( "widget/colorpicker" ),
        Mask = require( "widget/mask" ),
        CONF = require( "base/sysconf" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "ColorPPanel", {

        base: require( "widget/ppanel" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                break: true,
                selected: -1,
                textAlign: 'left',
                items: []
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'ColorPPanel';

            if ( options !== marker ) {
                this.__render();
            }

        },

        select: function ( color ) {
            this.__colorpickerWidget.trigger('pickcolor', color);
            return this;
        },

        attachTo: function ($obj){
            var _self = this;
            $obj.on('click', function (){
                _self.appendTo($obj.getElement().ownerDocument.body);
                _self.positionTo($obj);
                _self.show();
            });
        },

        open: function (){
            this.__maskWidget.show();
            this.show();
        },

        close: function (){
            this.__maskWidget.hide();
            this.hide();
        },

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "colorppanel" );

            this.__maskWidget = new Mask(this.__options.mask);
            this.__colorpickerWidget = new ColorPicker(this.__options);
            this.__colorpickerWidget.appendTo(this.__element);

            this.__initColorPPanelEvent();

        },

        // 初始化点击事件
        __initColorPPanelEvent: function () {

            var _self = this;
            this.__colorpickerWidget.on('pickcolor', function (color){
                _self.trigger('pickcolor', color);
                _self.hide();
            });
            this.__maskWidget.on('click', function (){
                _self.hide();
            });

        }

    } );
} );
