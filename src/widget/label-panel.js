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

        __defaultOptions: {
            layout: 'bottom',
            label: {
                width: '100%'
            }
        },

        __labelWidget: null,

        widgetName: 'LabelPanel',

        constructor: function ( options ) {

            this.__initOptions();
            this.__labelWidget = new Label( this.__options.label );

        },

        __render: function () {

            if ( this.isBadCall() ) {
                return this;
            }

            var oldMargin = this.__options.margin,
                $contentElement = null;

            if ( this.__rendered ) {
                return this;
            }

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "label-panel" );

            $contentElement = $( '<div class="fui-label-panel-content"></div>' );
            $( this.__contentElement ).append( $contentElement );

            // 重置margin, 避免添加label时被添加margin值
            this.__options.margin = 0;

            this.appendWidget( this.__labelWidget );

            this.__options.margin = oldMargin;

            // 更新contentElement
            this.__contentElement = $contentElement[ 0 ];

            return this;

        },

        __initOptions: function () {

            var label = this.__options.label;

            this.callBase();

            if ( typeof label === "string" ) {
                this.__options.label = {
                    text: label,
                    width: this.__defaultOptions.label.width
                }
            }

        }


    } );
} );
