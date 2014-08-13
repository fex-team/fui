/**
 * Buttonset对象
 * 通用按钮构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        ToggleButton = require( "widget/toggle-button" );

    return require( "base/utils" ).createClass( "Buttonset", {

        base: require( "widget/panel" ),

        constructor: function ( options ) {

            var defaultOptions = {
                // 初始选中项, -1表示不选中任何项
                selected: -1
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        getButtons: function () {
            return this.getWidgets();
        },

        getButton: function ( index ) {
            return this.getWidgets()[ index ] || null;
        },

        getValue: function () {

            if ( this.__currentIndex > -1 ) {
                return this.__widgets[ this.__currentIndex ].getValue();
            }

            return null;

        },

        getSelectedIndex: function () {
            return this.__currentIndex;
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
                return this.clearSelect();
            }

            indexOrWidget = this.__widgets[ indexOrWidget ];

            this.__pressButton( indexOrWidget );

            return this;

        },

        selectByValue: function(value) {
            var values = this.__widgets.map(function(button) {
                return button.getValue();
            });
            return this.select(values.indexOf(value));
        },

        clearSelect: function() {
            this.__pressButton(null);
            return this;
        },

        removeButton: function () {
            return this.removeWidget.apply( this, arguments );
        },

        insertWidget: function ( index, widget ) {

            var returnValue = this.callBase( index, widget );

            if ( returnValue === null ) {
                return returnValue;
            }

            if ( index <= this.__currentIndex ) {
                this.__currentIndex++;
            }

            if ( index <= this.__prevIndex ) {
                this.__prevIndex++;
            }

            return returnValue;

        },

        removeWidget: function ( widget ) {

            var index = widget;

            if ( typeof index !== "number" ) {
                index = this.indexOf( widget );
            }

            widget = this.callBase( widget );

            if ( index === this.__currentIndex ) {
                this.__currentIndex = -1;
            } else if ( index < this.__currentIndex ) {
                this.__currentIndex--;
            }

            if ( index === this.__prevIndex ) {
                this.__prevIndex = -1;
            } else if ( index < this.__prevIndex ) {
                this.__prevIndex--;
            }

            return widget;

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Buttonset';
            // 当前选中项
            this.__currentIndex = this.__options.selected;
            // 前一次选中项
            this.__prevIndex = -1;

        },

        __render: function () {

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "buttonset" );

            this.__initButtons();

            return this;

        },

        __initButtons: function () {

            var _self = this,
                buttonWidget = null;

            $.each( this.__options.buttons, function ( index, buttonOption ) {

                buttonWidget = new ToggleButton( $.extend( {}, buttonOption, {
                    pressed: index === _self.__options.selected,
                    preventDefault: true
                } ) );

                // 切换
                buttonWidget.__on( 'click', function ( e ) {

                    if ( !_self.isDisabled() ) {
                        _self.__pressButton( this );
                    }

                } );

                buttonWidget.__on( 'change', function ( e ) {

                    // 阻止buton本身的事件向上冒泡
                    e.stopPropagation();

                } );

                _self.appendButton( buttonWidget );

            } );

        },

        /**
         * 按下指定按钮, 该方法会更新其他按钮的状态和整个button-set的状态
         * @param button
         * @private
         */
        __pressButton: function ( button ) {

            this.__prevIndex = this.__currentIndex;
            this.__currentIndex = this.indexOf( button );

            if ( this.__currentIndex === this.__prevIndex ) {
                return;
            }

            if ( button ) {
                button.press();
            }

            // 弹起其他按钮
            $.each( this.__widgets, function ( i, otherButton ) {

                if ( otherButton !== button ) {
                    otherButton.bounce();
                }

            } );

            this.trigger( 'change', {
                currentIndex: this.__currentIndex,
                prevIndex: this.__prevIndex
            } );

        },

        __valid: function ( ele ) {
            return ele instanceof ToggleButton;
        }

    } );

} );