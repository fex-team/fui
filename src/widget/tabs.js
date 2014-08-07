/**
 * Tabs Widget
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        tpl = require( "tpl/tabs" ),
        Button = require( "widget/button" ),
        Panel = require( "widget/panel" ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "Tabs", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                selected: 0,
                buttons: [],
                panels: null
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        getButtons: function () {
            return this.__btns;
        },

        getButton:function ( index ) {
            return this.getButtons()[ index ] || null;
        },

        getButtonByValue: function ( value ) {

            var button = null;

            $.each( this.__btns, function ( btn ) {

                if ( btn.getValue() === value ) {
                    button = btn;
                    return false;
                }

            } );

            return button;

        },

        getPanels: function () {
            return this.__panels;
        },

        getPanel: function ( index ) {
            return this.getPanels()[ index ] || null;
        },

        getPanelByValue: function ( value ) {

            var panel = null;

            $.each( this.__panels, function ( pan ) {

                if ( pan.getValue() === value ) {
                    panel = pan;
                    return false;
                }

            } );

            return panel;

        },

        getSelectedIndex: function () {
            return this.__selected;
        },

        getSelected: function () {

            var index = this.getSelectedIndex();

            return {
                button: this.getButton( index ),
                panel: this.getPanel( index )
            };

        },

        /**
         * 选择接口
         * @param index 需要选中的tab页索引
         */
        select: function ( index ) {

            var toInfo = null;

            if ( !this.__selectItem( index ) ) {
                return this;
            }

            toInfo = this.__getInfo( index );

            this.trigger( "tabsselect", toInfo );

            if ( this.__prevSelected !== this.__selected ) {

                this.trigger( "tabschange", {
                    from: this.__getInfo( this.__prevSelected ),
                    toInfo: toInfo
                } );

            }

            return this;

        },

        getIndexByButton: function ( btn ) {
            return $.inArray( btn, this.__btns );
        },

        /**
         * 把所有button追加到其他容器中
         */
        appendButtonTo: function ( container ) {

            $.each( this.__btns, function ( index, btn ) {
                btn.appendTo( container );
            } );

        },

        appendPanelTo: function ( container ) {

            $.each( this.__panels, function ( index, panel ) {
                panel.appendTo( container );
            } );

        },

        __render: function () {

            var _self = this,
                btnWrap = null,
                panelWrap = null;

            this.callBase();

            btnWrap = $( ".fui-tabs-button-wrap", this.__element )[ 0 ];
            panelWrap = $( ".fui-tabs-panel-wrap", this.__element )[ 0 ];

            $.each( this.__options.buttons, function ( index, opt ) {

                var btn = null;

                if ( typeof opt !== "object" ) {
                    opt = {
                        label: opt
                    };
                }

                btn = new Button( opt );

                btn.on( "click", function () {

                    _self.select( _self.getIndexByButton( this ) );

                } );

                _self.__btns.push( btn );
                btn.appendTo( btnWrap );

            } );

            $.each( this.__options.panels, function ( index, opt ) {

                var panel = null;

                opt = opt || {
                    hide: true
                };

                opt.hide = true;

                panel= new Panel( opt );

                _self.__panels.push( panel );
                panel.appendTo( panelWrap );

            } );

            this.__selectItem( this.__options.selected );

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Tabs';
            this.__tpl = tpl;

            this.__btns = [];
            this.__panels = [];
            this.__prevSelected = -1;
            this.__selected = -1;

            // panels不设置的情况下， 将根据button创建
            if ( this.__options.panels === null ) {
                this.__options.panels = [];
                this.__options.panels.length = this.__options.buttons.length;
            }

        },

        __selectItem: function ( index ) {

            var btn = this.getButton( index ),
                prevBtn = this.getButton( this.__selected ),
                className = CONF.classPrefix + "selected";

            if ( !btn ) {
                return false;
            }

            if ( prevBtn ) {
                prevBtn.removeClass( className );
                this.getPanel( this.__selected ).hide();
            }

            btn.addClass( className );
            this.getPanel( index ).show();

            this.__prevSelected = this.__selected;
            this.__selected = index;

            return true;

        },

        // 根据给定的tab索引获取先关的信息， 这些信息将用于事件携带的参数
        __getInfo: function ( index ) {

            return {
                index: index,
                button: this.getButton( index ),
                panel: this.getPanel( index )
            }


        }

    } );

} );