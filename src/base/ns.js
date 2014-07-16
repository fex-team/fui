/**
 * FUI名称空间
 */

define( function () {

    // 容纳所有构件的实例池
    var WIDGET_POOL = {};

    return {

        widgets: WIDGET_POOL,

        /**
         * 暴露命名空间本身
         * @private
         */
        __export: function () {

            window.FUI = this;

        },

        ___register: function ( widgetName, widget ) {

            if ( typeof widgetName === "string" ) {
                this[ widgetName ] = widget;
            } else {

                widget = widgetName;

                for ( var key in widget ) {

                    if ( !widget.hasOwnProperty( key ) ) {
                        continue;
                    }

                    this[ key ] = widget[ key ];

                }

            }

        },

        __registerInstance: function ( widget ) {
            WIDGET_POOL[ widget.getId() ] = widget;
        }

    };

} );