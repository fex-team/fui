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

            var defaultOptions = {
                layout: 'bottom'
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

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

            this.__labelWidget = new Label( this.__options.label );

            this.callBase();

            $( this.__element ).addClass( CONF.classPrefix + "label-panel" );
            $( this.__element ).addClass( CONF.classPrefix + "layout-" + this.__options.layout );

            $contentElement = $( '<div class="fui-label-panel-content"></div>' );

            this.__contentElement.appendChild( this.__labelWidget.getElement() );
            this.__contentElement.appendChild( $contentElement[ 0 ] );

            // 更新contentElement
            this.__contentElement = $contentElement[ 0 ];

            return this;

        },

        __initOptions: function () {

            var label = this.__options.label;

            this.callBase();

            this.widgetName = 'LabelPanel';

            this.__labelWidget = null;

            if ( typeof label !== "object" ) {
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
