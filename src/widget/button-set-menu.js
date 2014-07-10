/**
 * InputMenu构件
 * 可接受输入的下拉菜单构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        tpl = require( "tpl/input-menu" ),
        InputButton = require( "widget/input-button" ),
        Menu = require( "widget/menu" ),
        Mask = require( "widget/mask" ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "InputMenu", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                input: null,
                menu: null,
                mask: null
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'InputMenu';
            this.__tpl = tpl;

            // 最后输入时间
            this.__lastTime = 0;
            // 最后选中的记录
            this.__lastSelect = null;

            this.__inputWidget = null;
            this.__menuWidget = null;
            this.__maskWidget = null;
            // menu状态， 记录是否已经append到dom树上
            this.__menuState = false;

            if ( options !== marker ) {
                this.__render();
            }

        },

        select: function ( index ) {
            this.__menuWidget.select( index );
        },

        setValue: function ( value ) {

            this.__inputWidget.setValue( value );
            return this;

        },

        getValue: function () {
            return this.__inputWidget.getValue();
        },

        __render: function () {

            if ( this.__rendered ) {
                return this;
            }

            this.__inputWidget = new InputButton( this.__options.input );
            this.__menuWidget = new Menu( this.__options.menu );
            this.__maskWidget = new Mask( this.__options.mask );

            this.callBase();

            this.__inputWidget.appendTo( this.__element );
            this.__menuWidget.positionTo( this.__inputWidget );

            this.__initInputMenuEvent();

        },

        open: function () {
            this.__maskWidget.show();
            this.__menuWidget.show();
        },

        close: function () {
            this.__maskWidget.hide();
            this.__menuWidget.hide();
        },

        __initInputMenuEvent: function () {

            var _self = this;

            this.on( "buttonclick", function () {

                if ( !this.__menuState ) {
                    this.__appendMenu();
                    this.__menuState = true;
                }

                this.__inputWidget.unfocus();

                this.open();

            } );

            this.on( "keypress", function ( e ) {
                this.__lastTime = new Date();
            } );

            this.on( "keyup", function ( e ) {

                if ( e.keyCode !== 8 && e.keyCode !== 13 && new Date() - this.__lastTime < 500 ) {
                    this.__update();
                }

            } );

            this.on( "inputcomplete", function () {

                this.__inputWidget.selectRange( 99999999 );
                this.__inputComplete();

            } );

            this.__menuWidget.on( "select", function ( e, info ) {

                e.stopPropagation();

                _self.setValue( info.value );

                _self.trigger( "select", info );

                _self.close();

            } );

            this.__menuWidget.on( "change", function ( e, info ) {

                e.stopPropagation();

                _self.trigger( "change", info );

            } );

            // 阻止input自身的select和change事件
            this.__inputWidget.on( "select change", function ( e ) {
                e.stopPropagation();
            } );

            // mask 点击关闭
            this.__maskWidget.on( "maskclick", function () {
                _self.close();
            } );

            // 记录最后选中的数据
            this.on( "select", function ( e, info ) {

                this.__lastSelect = info;

            } );

        },

        // 更新输入框内容
        __update: function () {

            var inputValue = this.getValue(),
                lowerCaseValue = inputValue.toLowerCase(),
                values = this.__getItemValues(),
                targetValue = null;

            if ( !inputValue ) {
                return;
            }

            $.each( values, function ( i, val ) {

                if ( val.toLowerCase().indexOf( lowerCaseValue ) === 0 ) {
                    targetValue = val;
                    return false;
                }

            } );

            if ( targetValue ) {

                this.__inputWidget.setValue( targetValue );
                this.__inputWidget.selectRange( inputValue.length );

            }

        },

        // 获取所有item的值列表
        __getItemValues: function () {

            var vals = [];

            $.each( this.__menuWidget.getWidgets(), function ( index, item ) {

                vals.push( item.getValue() );

            } );

            return vals;

        },

        // 用户输入完成
        __inputComplete: function () {

            var values = this.__getItemValues(),
                targetIndex = -1,
                inputValue = this.getValue(),
                lastSelect = this.__lastSelect;

            $.each( values, function ( i, val ) {

                if ( val === inputValue ) {
                    targetIndex = i;
                    return false;
                }

            } );

            this.trigger( "select", {
                index: targetIndex,
                value: inputValue
            } );

            if ( !lastSelect || lastSelect.value !== inputValue ) {

                this.trigger( "change", {
                    from: lastSelect || {
                        index: -1,
                        value: null
                    },
                    to: {
                        index: targetIndex,
                        value: inputValue
                    }
                } );

            }

        },

        __appendMenu: function () {

            this.__menuWidget.appendTo( this.__inputWidget.getElement().ownerDocument.body );

        }

    } );

} );