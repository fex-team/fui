/**
 * widget对象
 * 所有的UI组件都是widget对象
 */

define( function ( require ) {

    var prefix = '_fui_',
        uid = 0,
        CONF = require( "base/sysconf" ),
        $ = require( "base/jquery" ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "Widget", {

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                className: '',
                disabled: false,
                preventDefault: false
            };

            this.__widgetType = 'widget';
            this.__tpl = '';
            this.__compiledTpl = '';
            this.__rendered = false;
            this.__options = {};
            this.__element = null;
            this.widgetName = 'Widget';

            this.__uid = generatorId();

            this.__extendOptions( defaultOptions, options );

            if ( options !== marker ) {
                this.__render();
            }

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

            this.__compiledTpl = Utils.Tpl.compile( this.__tpl, this.__options );
            this.__element = $( this.__compiledTpl )[ 0 ];

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

            return this;

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

            if ( Utils.Widget.isContainer( container ) ) {

                container.getContentElement().appendChild( this.__element );

            } else if ( Utils.isElement( container ) ) {

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

        __on: function ( type, cb ) {

            var _self = this;

            cb.__fui_listener = function ( e ) {

                if ( !_self.isDisabled() ) {
                    cb.apply( _self, arguments );
                }

            };

            $( this.__element ).on( type, cb.__fui_listener );

            return this;

        },

        trigger: function ( type, params ) {

            if ( !this.__options.preventDefault ) {
                $( this.__element ).trigger( type, [].slice.call( arguments, 1 ) );
            }

            return this;

        },

        __trigger: function ( type, params ) {

            $( this.__element ).trigger( type, [].slice.call( arguments, 1 ) );

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

        }

    } );

    // 为widget生成唯一id
    function generatorId () {

        uid++;
        return prefix + uid;

    }

} );