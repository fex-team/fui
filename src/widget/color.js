/**
 * 颜色选择器类： colorpicker
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        colorTpl = require( "tpl/color" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Color", {

        base: require( "widget/container" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                width: null,
                height: null,
                padding: null,
                margin: 0,
                commonText: '',
                commonColor: [
                    [
                        '#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd',
                        '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646'
                    ],
                    [
                        '#f2f2f2', '#808080', '#ddd8c2', '#c6d9f1', '#dbe5f1',
                        '#f2dbdb', '#eaf1dd', '#e5dfec', '#daeef3', '#fde9d9'
                    ],
                    [
                        '#d9d9d9', '#595959', '#c4bc96', '#8db3e2', '#b8cce4',
                        '#e5b8b7', '#d6e3bc', '#ccc0d9', '#b6dde8', '#fbd4b4'
                    ],
                    [
                        '#bfbfbf', '#404040', '#938953', '#548dd4', '#95b3d7',
                        '#d99594', '#c2d69b', '#b2a1c7', '#92cddc', '#fabf8f'
                    ],
                    [
                        '#a6a6a6', '#262626', '#4a442a', '#17365d', '#365f91',
                        '#943634', '#76923c', '#5f497a', '#31849b', '#e36c0a'
                    ],
                    [
                        '#7f7f7f', '#0d0d0d', '#1c1a10', '#0f243e', '#243f60',
                        '#622423', '#4e6128', '#3f3151', '#205867', '#974706'
                    ]
                ],
                standardText: '',
                standardColor: [
                        '#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050',
                        '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'
                ]
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Color';

            this.__tpl = colorTpl;

            if ( options !== marker ) {
                this.__render();
            }

        },

        appendWidget: function ( widget ) {

            var returnValue = this.callBase( widget );

            if ( this.__options.margin ) {
                widget.getElement().style.margin = this.__options.margin;
            }

            return returnValue;

        },

        insertWidget: function ( index, widget ) {

            var returnValue = this.callBase( index, widget );

            if ( this.__options.margin ) {
                widget.getElement().style.margin = this.__options.margin;
            }

            return returnValue;

        },

        __render: function () {

            var $content = null;

            if ( this.__rendered ) {
                return this;
            }

            this.__initOptions();

            this.callBase();

            this.__initColorPickerEvents();

        },

        __initOptions: function () {

        },

        __initColorPickerEvents: function (){

            var _self = this;
            $(this.__element).find('.fui-colorpicker-item').click(function (){
                var color = $(this).css('background-color');
                _self.trigger('pickcolor', color);
            });
        }

    } );

} );
