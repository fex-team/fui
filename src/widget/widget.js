/**
 * widget对象
 * 所有的UI组件都是widget对象
 */

define( function ( require ) {

    var prefix = '_fui_',
        uid = 0,
        CONF = require( "base/sysconf" ),
        FUI_NS = require( "base/ns" ),
        $ = require( "base/jquery" ),
        Utils = require( "base/utils" );

    var Widget = require( "base/utils" ).createClass( "Widget", {

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                id: null,
                className: '',
                disabled: false,
                preventDefault: false,
                text: '',
                value: null,
                hide: false,
                width: null,
                height: null
            };

            this.__widgetType = 'widget';
            this.__tpl = '';
            this.__compiledTpl = '';
            this.__rendered = false;
            this.__options = {};
            this.__element = null;
            // 禁止获取焦点
            this.__allow_focus = false;

            this.widgetName = 'Widget';

            this.__extendOptions( defaultOptions, options );

            if ( options !== marker ) {
                this.__render();
            }

        },

        getId: function () {
            return this.id;
        },

        getValue: function () {
            return this.__options.value;
        },

        setValue: function ( value ) {
            this.__options.value = value;
            return this;
        },

        show: function () {

            this.__show();
            return this;

        },

        hide: function () {

            this.__hide();
            return this;

        },

        addClass: function ( className ) {

            $( this.__element).addClass( className );

        },

        removeClass: function ( className ) {

            $( this.__element).removeClass( className );

        },

        /**
         * 当前构件是否是处于禁用状态
         * @returns {boolean|disabled|jsl.$.disabled|id.disabled}
         */
        isDisabled: function () {
            return this.__options.disabled;
        },

        /**
         * 启用当前构件
         * @returns {Widget}
         */
        enable: function () {
            this.__options.disabled = false;
            $( this.__element ).removeClass( CONF.classPrefix + "disabled" );
            return this;
        },

        /**
         * 禁用当前构件
         * @returns {Widget}
         */
        disable: function () {
            this.__options.disabled = true;
            $( this.__element ).addClass( CONF.classPrefix + "disabled" );
            return this;
        },

        /**
         * 获取
         * @returns {null}
         */
        getElement: function () {
            return this.__element;
        },

        appendTo: function ( container ) {

            if ( Utils.isElement( container ) ) {

                container.appendChild( this.__element );

            } else {

                throw new Error( 'TypeError: Widget.appendTo()' );

            }

        },

        off: function ( type, cb ) {

            $( this.__element ).off( cb && cb.__fui_listener );

            return this;

        },

        on: function ( type, cb ) {

            if ( !this.__options.preventDefault ) {
                this.__on( type, cb );
            }

            return this;

        },

        /**
         * 根据模板渲染构件, 如果该构件已经渲染过, 则不会进行二次渲染
         * @returns {Widget}
         */
        __render: function () {

            var $ele = null,
                className = null;

            if ( this.__rendered ) {
                return this;
            }

            this.__rendered = true;

            this.id = this.__id();

            // 向NS注册自己
            FUI_NS.__registerInstance( this );

            this.__compiledTpl = Utils.Tpl.compile( this.__tpl, this.__options );
            this.__element = $( this.__compiledTpl )[ 0 ];
            this.__element.setAttribute( "id", this.id );

            $ele = $( this.__element );

            if ( this.__options.disabled ) {
                $ele.addClass( CONF.classPrefix + "disabled" );
            }

            $ele.addClass( CONF.classPrefix + "widget" );

            // add custom class-name
            className = this.__options.className;
            if ( className.length > 0 ) {
                if ( $.isArray( className ) ) {
                    $ele.addClass( className.join( " " ) );
                } else {
                    $ele.addClass( className );
                }
            }

            this.__initCommonStyle();

            if ( this.__options.hide ) {
                this.__hide();
            }

            this.__initWidgetEvent();

            return this;

        },

        __initWidgetEvent: function () {

            this.on( "mousedown", function ( e ) {

                if ( !this.__allowFocus() ) {
                    e.preventDefault();
                } else {
                    e.stopPropagation();
                }

            } );

        },

        __on: function ( type, cb ) {

            var _self = this;

            cb.__fui_listener = function ( e, widget ) {

                var params = [];

                for ( var i = 0, len = arguments.length; i < len; i++ ) {

                    if ( i !== 1 ) {
                        params.push( arguments[ i ] );
                    }

                }

                e.widget = widget;

                if ( !_self.isDisabled() ) {
                    cb.apply( _self, params );
                }

            };

            $( this.__element ).on( type, cb.__fui_listener );

            return this;

        },

        trigger: function ( type, params ) {

            if ( !this.__options.preventDefault ) {
                this.__trigger.apply( this, arguments );
            }

            return this;

        },

        __allowShowTitle: function () {
            return true;
        },

        __allowFocus: function () {
            return !!this.__allow_focus;
        },

        __trigger: function ( type, params ) {

            $( this.__element ).trigger( type, [ this ].concat( [].slice.call( arguments, 1 ) ) );

            return this;

        },

        __extendOptions: function () {

            var args = [ {}, this.__options ].concat( [].slice.call( arguments, 0 ) ),
                params = [ true ];

            for ( var i = 0, len = args.length; i < len; i++ ) {
                if ( typeof args[ i ] !== "string" ) {
                    params.push( args[ i ] );
                }
            }

            this.__options = $.extend.apply( $, params );

        },

        __hide: function () {

            $( this.__element ).addClass( CONF.classPrefix + "hide" );

        },

        __show: function () {
            $( this.__element ).removeClass( CONF.classPrefix + "hide" );
        },

        __initCommonStyle: function () {

            if ( this.__options.text && this.__allowShowTitle() ) {
                this.__element.setAttribute( "title", this.__options.text );
            }

            if ( this.__options.width ) {
                this.__element.style.width = this.__options.width + 'px';
            }

            if ( this.__options.height ) {
                this.__element.style.height = this.__options.height + 'px';
            }

        },

        __id: function () {
            return this.__options.id || generatorId();
        }

    } );

    // 为widget生成唯一id
    function generatorId () {

        return prefix + ( ++uid );

    }

    return Widget;

} );