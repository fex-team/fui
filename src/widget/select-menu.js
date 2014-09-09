/**
 * SelectMenu构件
 * 提供从下拉菜单中选中某一项的功能构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        Panel = require( "widget/panel" ),
        PPanel = require( "widget/ppanel" ),
        Button = require( "widget/button" ),
        Creator = require( "base/creator" ),
        Mask = require( "widget/mask" );

    return require( "base/utils" ).createClass( "SelectMenu", {

        base: Panel,

        constructor: function ( options ) {

            var defaultOptions = {
                // bed 是Panel的实例
                bed: {
                    className: 'fui-select-menu-bed'
                },
                button: {
                    className: 'fui-select-menu-btn'
                },
                events: [ "btnclick" ],
                selected: -1
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        show: function () {
            this.__widgetMenu.show();
            this.__mask.show();
        },

        hide: function () {
            this.__widgetMenu.hide();
            this.__mask.hide();
        },

        getValue: function () {
            var selectedWidet = this.__widgets[ this.__selected ];
            return selectedWidet ? selectedWidet.getValue() : null;
        },

        getSelected: function () {
            return this.__widgets[ this.__selected ];
        },

        select: function ( index ) {

            var widget = this.__widgets[ index ],
                className = "fui-select-menu-selected",
                oldIndex = this.__selected,
                oldSelected = this.__widgets[ this.__selected ],
                bedElement = this.__bed.getElement();

            if ( oldSelected ) {
                oldSelected.removeClass( className );
            }

            bedElement.innerHTML = '';
            bedElement.appendChild( widget.cloneElement() );

            widget.addClass( className );

            this.__selected = index;

            this.trigger( "select", {
                index: index,
                widget: widget
            } );


            if ( this.__selected !== oldIndex ) {

                this.trigger( "change", {
                    from: {
                        index: oldIndex,
                        widget: oldSelected
                    },
                    to: {
                        index: index,
                        widget: widget
                    }
                } );

            }

        },

        selectByWidget: function ( widget ) {
            return this.select( this.indexOf( widget ) );
        },

        __render: function () {

            this.__bed = new Panel( this.__options.bed );
            this.__dropBtn = new Button( this.__options.button );
            this.__widgetMenu = new PPanel( {
                className: 'fui-select-menu-container',
                layout: CONF.layout.LEFT_TOP,
                column: this.__column
            } );
            this.__mask = new Mask();

            var widgets = this.__initWidgets();

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "select-menu" );

            this.appendWidgets( [ this.__bed, this.__dropBtn, this.__mask, this.__widgetMenu ] );

            this.__widgets = [];
            this.__oldContentElement = this.__contentElement;
            this.__contentElement = this.__widgetMenu;

            this.appendWidgets( widgets );

            this.__widgetMenu.positionTo( this.getElement() );

            if ( !$.isNumeric( this.__options.selected ) ) {

                this.__bed.appendWidget( Creator.parse( this.__options.selected ) );

            } else if ( this.__options.selected != -1 ) {

                this.select( this.__options.selected );

            }

        },

        __initWidgets: function () {

            var widgets = [];

            if ( !this.__options.widgets ) {
                return;
            }

            $.each( this.__options.widgets, function ( index, widget ) {

                widgets.push( Creator.parse( widget ) );

            } );

            return widgets;

        },

        __initEvent: function () {

            this.callBase();

            var _self = this;

            this.__dropBtn.on( "btnclick", function () {
                _self.show();
            } );

            this.__mask.on( "click", function () {
                _self.hide();
            } );

            this.__widgetMenu.on( this.__options.events.join( " " ), function ( e ) {

                var target = e.target;

                if ( target === _self.__oldContentElement || target === _self.getElement ) {
                    return;
                }

                e.stopPropagation();

                _self.selectByWidget( e.widget );
                _self.hide();

                return false;

            } );

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'SelectMenu';

            // 被选中的元素
            this.__bed = null;
            // 下拉按钮
            this.__dropBtn = null;
            this.__widgetMenu = null;
            this.__mask = null;
            this.__widgets = [];

            this.__selected = -1;
            this.__oldContentElement = null;

            this.__column = this.__options.column;

            delete this.__options.column;

        }

    } );

} );