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

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                break: true,
                selected: -1,
                items: []
            };

            this.__extendOptions( defaultOptions, options );
            this.__prevSelect = -1;
            this.__currentSelect = this.__options.selected;

            this.widgetName = 'Menu';

            if ( options !== marker ) {
                this.__render();
            }

        },

        select: function ( index ) {

            var item = this.__widgets[ index ];

            if ( !item ) {
                return this;
            }

            this.__selectItem( item );

            return this;

        },

        __render: function () {

            var _self = this,
                selected = _self.__options.selected;

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "menu" );

            $.each( this.__options.items, function ( index, itemOption ) {

                if ( typeof itemOption === "string" ) {
                    itemOption = {
                        label: itemOption
                    };
                }

                itemOption.selected = index === selected;

                _self.appendItem( new Item( itemOption ) );

            } );

            this.__initEvent();

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
                index: this.__currentSelect
            } );

            if ( this.__prevSelect !== this.__currentSelect ) {

                this.trigger( "change", {
                    from: this.__prevSelect,
                    to: this.__currentSelect
                } );

            }

        },

        __valid: function ( target ) {
            return target instanceof Item;
        }

    } );
} );
