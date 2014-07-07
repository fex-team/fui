/**
 * 构件相关工具方法
 */

define( function ( require ) {

    return {

        isContainer: function ( widget ) {

            return widget.__widgetType === 'container';

        }

    };

} );