/**
 * ToggleButton对象
 * 可切换按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" );

    return require( "base/utils" ).createClass( "ToggleButton", {

        base: require( "widget/button" ),

        constructor: function ( options ) {

            var defaultOptions = {
                // 按钮初始时是否按下
                pressed: false
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        /**
         * 当前按钮是否已按下
         */
        isPressed: function () {
            return this.__state;
        },

        /**
         * 按下按钮
         */
        press: function () {

            var className = CONF.classPrefix + "button-pressed";

            $( this.__element ).addClass( className );
            this.__updateState( true );

        },

        /**
         * 弹起按钮
         */
        bounce: function () {

            var className = CONF.classPrefix + "button-pressed";

            $( this.__element ).removeClass( className );
            this.__updateState( false );

        },

        toggle: function () {

            if ( this.__state ) {
                this.bounce();
            } else {
                this.press();
            }

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'ToggleButton';
            // 按钮当前状态
            this.__state = false;

        },

        __render: function () {

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "toggle-button" );

            this.__initButtonState();

            return this;

        },

        __initButtonState: function () {

            if ( !this.__options.pressed ) {
                return;
            }

            // 不直接调用press方法， 防止初始化时事件的触发
            $( this.__element ).addClass( CONF.classPrefix + "button-pressed" );
            this.__state = true;

        },

        /**
         * 初始化事件监听, 控制状态的切换
         * @private
         */
        __initEvent: function () {

            this.callBase();

            this.on( "click", function () {

                this.toggle();

            } );

        },

        __updateState: function ( state ) {

            state = !!state;
            this.__state = state;
            this.trigger( "change", state, !state );

        }

    } );

} );