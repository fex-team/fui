/**
 * 通用工具包
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        __marker = '__fui__marker__' + ( +new Date() );

    return {

        isElement: function ( target ) {
            return target.nodeType === 1;
        },

        /**
         * 根据传递进来的key列表， 从source中获取对应的key， 并进行处理，最终生成一个css声明映射表
         * 该方法处理过的结果可以交由模板调用Helper.toCssText方法生成inline style样式规则
         * @param keys 可以是数组， 也可以是object。 如果是数组， 则最终生成的css声明映射中将以该数组中的元素作为其属性名；
         *              如果是object, 则取值时以object的key作为source中的key， 在生成css声明映射时，则以keys参数中的key所对应的值作为css声明的属性名.
         * @returns {{}}
         */
        getCssRules: function ( keys, source ) {

            var mapping = {},
                tmp = {},
                value = null;

            if ( $.isArray( keys ) ) {

                for ( var i = 0, len = keys.length; i < len; i++ ) {

                    value = keys[ i ];
                    if ( typeof value === 'string' ) {
                        tmp[ value ] = value;
                    } else {

                        for ( var key in value ) {
                            if ( value.hasOwnProperty( key ) ) {
                                tmp[ key ] = value[ key ];
                                // 只取一个
                                break;
                            }
                        }

                    }

                }

                keys = tmp;

            }

            for ( var key in keys ) {

                if ( keys.hasOwnProperty( key ) ) {

                    value = source[ key ];

                    if ( value !== null && value !== undefined ) {

                        mapping[ keys[ key ] ] = value;

                    }

                }

            }

            return mapping;

        },

        getMarker: function () {

            return __marker;

        },

        getRect: function ( node ) {
            return node.getBoundingClientRect();
        },

        getBound: function ( node ) {

            var w = 0,
                h = 0;

            if ( node.tagName.toLowerCase() === 'body' ) {

                h = $( node.ownerDocument.defaultView );
                w = h.width();
                h = h.height();

                return {
                    top: 0,
                    left: 0,
                    bottom: h,
                    right: w,
                    width: w,
                    height: h
                };

            } else {

                return node.getBoundingClientRect();

            }

        },

        getCssValue: function ( props, node ) {

            var styleList = node.ownerDocument.defaultView.getComputedStyle( node, null );

        }

    }

} );