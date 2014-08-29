/**
 * UI系统配置
 */

define( function ( require ) {

    var NS = require( "base/ns" );

    return {

        classPrefix: 'fui-',

        layout: {
            TOP: 'top',
            LEFT: 'left',
            BOTTOM: 'bottom',
            RIGHT: 'right',
            CENTER: 'center',
            MIDDLE: 'middle',
            // 内部定位
            LEFT_TOP: 'left-top',
            RIGHT_TOP: 'right-top',
            LEFT_BOTTOM: 'left-bottom',
            RIGHT_BOTTOM: 'right-bottom'
        },

        allowFocus: !!NS.ALLOW_FOCUS,

        control: {
            input: 1,
            textarea: 1,
            button: 1,
            select: 1,
            option: 1,
            object: 1,
            embed: 1
        }

    };

} );
