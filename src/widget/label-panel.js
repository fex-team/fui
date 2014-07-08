/**
 * LabelPanel Widget
 * 带标签的面板
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        Label = require( "widget/label" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "LabelPanel", {

        base: require( "widget/panel" ),

        constructor: function ( options ) {

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                layout: 'bottom'
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'LabelPanel';

            this.__labelWidget = null;

            if ( options !== marker ) {
                this.__render();
            }

        },

        disable: function () {

            this.callBase();
            this.__labelWidget.disable();

        },

        enable: function () {

            this.callBase();
            this.__labelWidget.enable();

        },

        __render: function () {

            var $contentElement = null;

            if ( this.__rendered ) {
                return this;
            }

            this.__initOptions();

            this.__labelWidget = new Label( this.__options.label );

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "label-panel" );
            $( this.__element ).addClass( CONF.classPrefix + "layout-" + this.__options.layout );

            $contentElement = $( '<div class="fui-label-panel-content"></div>' );

            this.__contentElement.appendChild( this.__labelWidget.getElement() );
            this.__contentElement.appendChild( $contentElement[ 0 ] );

            // 容器高度未设置， 则禁用定位属性， 避免自适应布局下的因流布局被破坏造成的重叠问题
            if ( this.__options.height === null ) {
                $( this.__element ).addClass( CONF.classPrefix + "no-position" );
                this.__contentElement.appendChild( this.__labelWidget.getElement() );
            }

            // 更新contentElement
            this.__contentElement = $contentElement[ 0 ];

            return this;

        },

        __initOptions: function () {

            var label = this.__options.label;

            this.callBase();

            if ( typeof label === "string" ) {
                this.__options.label = {
                    text: label
                }
            }

            if ( !this.__options.label.className ) {
                this.__options.label.className = '';
            }

            this.__options.label.className += ' fui-label-panel-label';

        }


    } );
} );
