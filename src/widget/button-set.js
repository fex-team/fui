/**
 * Button对象
 * 通用按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        ToggleButton = require( "widget/toggle-button" );

    return require( "base/utils" ).createClass( "Buttonset", {

        base: require( "widget/panel" ),

        widgetName: 'Buttonset',

        // 前一次选中项
        __prevIndex: -1,

        // 当前选中项
        __currentIndex: -1,

        __defaultOptions: {
            // 初始选中项, -1表示不选中任何项
            selected: -1
        },

        __userEvents: [ "change" ],

        __initButtons: function () {

            var _self = this,
                buttonWidget = null;

            $.each( this.__options.buttons, function ( index, buttonOption ) {

                // 禁止ToggleButton对象注册事件
                buttonOption.__clickToggle = false;
                buttonOption.pressed = false;

                buttonWidget = new ToggleButton( buttonOption );

                // 切换
                buttonWidget.__on( 'click', function () {

                    _self.__pressButton( this );

                    _self.trigger( 'change', {
                        currentIndex: _self.__currentIndex,
                        prevIndex: _self.__prevIndex,
                        currentButton: _self.getButton( _self.__currentIndex ),
                        prevButton: _self.getButton( _self.__prevIndex )
                    } );

                } );

                _self.appendButton( buttonWidget );

            } );

        },

        getButtons: function () {
            return this.getWidgets();
        },

        getButton: function ( index ) {
            return this.getWidgets()[ index ] || null;
        },

        appendButton: function () {
            return this.appendWidget.apply( this, arguments );
        },

        insertButton: function () {
            return this.insertWidget.apply( this, arguments );
        },

        select: function ( indexOrWidget ) {

            if ( this.__options.disabled ) {
                return this;
            }

            if ( indexOrWidget instanceof ToggleButton ) {
                indexOrWidget = $.inArray( indexOrWidget, this.__widgets );
            }

            if ( indexOrWidget < 0 ) {
                return this;
            }

            indexOrWidget = this.__widgets[ indexOrWidget ];

            indexOrWidget.trigger( "click" );

            return this;

        },

        removeButton: function () {
            return this.removeWidget.apply( this, arguments );
        },

        __render: function () {

            if ( this.isBadCall() ) {
                return this;
            }

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();
            $( this.__element ).addClass( CONF.classPrefix + "buttonset" )

            this.__initButtons();
            this.__initSelect();

            return this;

        },

        __initSelect: function () {

            var selectedWidget = null;


            if ( this.__options.selected > -1 ) {
                selectedWidget = this.__widgets[ this.__options.selected ];
            }

            if ( selectedWidget ) {
                this.__pressButton( selectedWidget );
            }

        },

        /**
         * 按下指定按钮, 该方法会更新其他按钮的状态和整个button-set的状态
         * @param button
         * @private
         */
        __pressButton: function ( button ) {

            var _self = this;

            button.press();

            this.__prevIndex = this.__currentIndex;

            // 弹起其他按钮
            $.each( this.__widgets, function ( i, otherButton ) {

                if ( otherButton !== button ) {
                    otherButton.bounce();
                } else {
                    _self.__currentIndex = i;
                }

            } );

        },

        __valid: function ( ele ) {
            return ele instanceof ToggleButton;
        }

    } );

} );