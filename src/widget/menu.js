/**
 * Menu Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        Item = require( "widget/item" ),
        CONF = require( "base/sysconf" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Menu", {

        base: require( "widget/ppanel" ),

        constructor: function ( options ) {

            var defaultOptions = {
                column: true,
                selected: -1,
                textAlign: 'left',
                items: []
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        select: function ( index ) {

            var item = this.__widgets[ index ];

            if ( !item ) {
                return this;
            }

            this.__selectItem( item );

            return this;

        },

        clearSelect: function () {

            var selectedItem = this.getSelectedItem();

            if ( selectedItem ) {
                selectedItem.unselect();
            }

            this.__currentSelect = -1;
            this.__prevSelect = -1;

        },

        getItems: function () {
            return this.getWidgets.apply( this, arguments );
        },

        getItem: function () {
            return this.getWidget.apply( this, arguments );
        },

        appendItem: function ( item ) {
            return this.appendWidget.apply( this, arguments );
        },

        insertItem: function ( item ) {
            return this.insertWidget.apply( this, arguments );
        },

        removeItem: function ( item ) {
            return this.removeWidget.apply( this, arguments );
        },

        clearItems: function() {
            while (this.getItems().length) {
                this.removeItem(0);
            }
            return this;
        },

        getSelected: function () {
            return this.__currentSelect;
        },

        getSelectedItem: function () {
            return this.getItem( this.__currentSelect );
        },

        insertWidget: function ( index, widget ) {

            var returnValue = this.callBase( index, widget );

            if ( returnValue === null ) {
                return returnValue;
            }

            if ( index <= this.__currentSelect ) {
                this.__currentSelect++;
            }

            if ( index <= this.__prevSelect ) {
                this.__prevSelect++;
            }

            return returnValue;

        },

        removeWidget: function ( widget ) {

            var index = widget;

            if ( typeof index !== "number" ) {
                index = this.indexOf( widget );
            }

            widget = this.callBase( widget );

            if ( index === this.__currentSelect ) {
                this.__currentSelect = -1;
            } else if ( index < this.__currentSelect ) {
                this.__currentSelect--;
            }

            if ( index === this.__prevSelect ) {
                this.__prevSelect = -1;
            } else if ( index < this.__prevSelect ) {
                this.__prevSelect--;
            }

            return widget;

        },

        __initOptions: function () {

            this.callBase();

            this.__prevSelect = -1;
            this.__currentSelect = this.__options.selected;

            this.widgetName = 'Menu';

        },

        __render: function () {

            var _self = this,
                textAlign = this.__options.textAlign,
                selected = this.__options.selected;

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "menu" );

            $.each( this.__options.items, function ( index, itemOption ) {

                if ( typeof itemOption !== "object" ) {
                    itemOption = {
                        label: itemOption
                    };
                }

                itemOption.selected = index === selected;
                itemOption.textAlign = textAlign;

                _self.appendItem( new Item( itemOption ) );

            } );

        },

        // 初始化点击事件
        __initEvent: function () {

            this.callBase();

            this.on( "itemclick", function ( e ) {

                this.__selectItem( e.widget );

            } );

        },

        __selectItem: function ( item ) {

            if ( this.__currentSelect > -1 ) {
                this.__widgets[ this.__currentSelect ].unselect();
            }

            this.__prevSelect = this.__currentSelect;
            this.__currentSelect = this.indexOf( item );

            item.select();

            this.trigger( "select", {
                index: this.__currentSelect,
                label: item.getLabel(),
                value: item.getValue()
            } );

            if ( this.__prevSelect !== this.__currentSelect ) {

                var fromItem = this.__widgets[ this.__prevSelect ] || null;

                this.trigger( "change", {
                    from: {
                        index: this.__prevSelect,
                        label: fromItem && fromItem.getLabel(),
                        value: fromItem && fromItem.getValue()
                    },
                    to: {
                        index: this.__currentSelect,
                        label: item.getLabel(),
                        value: item.getValue()
                    }
                } );

            }

        },

        __valid: function ( target ) {
            return target instanceof Item;
        }

    } );
} );
