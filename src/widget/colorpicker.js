/**
 * 容器类： PPanel = Positioning Panel
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        Mask = require( "widget/mask" ),
        tpl = require( "tpl/colorpicker" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "ColorPicker", {

        base: require( "widget/ppanel" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                clearText: '',
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

            this.widgetName = 'ColorPicker';

            this.__contentElement = null;
            this.__maskWidget = null;
            this.__inDoc = false;

            if ( options !== marker ) {
                this.__render();
            }

        },

        show: function () {

            if ( !this.__inDoc ) {
                this.__inDoc = true;
                this.appendTo( this.__element.ownerDocument.body );
            }

            this.__maskWidget.show();
            this.callBase();

            return this;

        },

        hide: function () {

            this.callBase();
            this.__maskWidget.hide();

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

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "colorpicker" );

            var contentHtml = Utils.Tpl.compile( tpl, this.__options );

            this.__contentElement.appendChild( $(contentHtml)[ 0 ] );
            this.__previewElement = $(this.__contentElement).find('.' + CONF.classPrefix + "colorpicker-preview");
            this.__clearElement = $(this.__contentElement).find('.' + CONF.classPrefix + "colorpicker-clear");

            this.__maskWidget = new Mask( this.__options.mask );

            this.__initColorPickerEvents();

        },

        // 初始化点击事件
        __initColorPickerEvents: function () {

            var _self = this;

            this.on('click', function (e){

                var color, $target = $(e.target);

                if ($target.hasClass(CONF.classPrefix + 'colorpicker-item')) {

                    color = $target.attr('data-color');
                    _self.trigger('selectcolor', color);
                    _self.hide();

                } else if ($target.hasClass(CONF.classPrefix + 'colorpicker-clear')) {

                    _self.trigger('selectcolor', '');
                    _self.hide();

                }

            });

            this.on('mouseover', function (e){

                var color, $target = $(e.target);

                if ($target.hasClass(CONF.classPrefix + 'colorpicker-item')) {

                    color = $target.attr('data-color');
                    $(_self.__element).find('.' + CONF.classPrefix + 'colorpicker-preview').css({
                        'background-color': color,
                        'border-color': color
                    });

                }

            });

            this.__maskWidget.on('click', function (){

                _self.hide();

            });

        }

    } );

} );
