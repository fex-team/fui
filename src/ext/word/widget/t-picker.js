/**
 * TPicker -- table 选择器
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        tpl = require( "ext/word/tpl/t-picker" ),
        Utils = require( "base/utils" );

    return require( "base/utils" ).createClass( "TPicker", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                // 10行 10列
                row: 10,
                col: 10
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'TPicker';
            this.__tpl = tpl;

            // 背板
            this.__backplane = null;

        },

        __render: function () {

            this.callBase();

            this.__backplane = this.__createBackplane();

            this.__element.appendChild( this.__backplane );

        },

        __initEvent: function () {

            var _self = this;

            this.callBase();

            $( this.__backplane ).delegate( 'td', 'mousemove click', function ( e ) {

                var info = e.target.getAttribute( "data-index" ).split( "," );

                info = {
                    row: parseInt( info[ 0 ], 10 ),
                    col: parseInt( info[ 1 ], 10 )
                }

                if ( e.type === "click" ) {
                    _self.__select( info.row, info.col );
                } else {
                    _self.__update( info.row, info.col );
                }

            } );

        },

        __select: function ( row, col ) {

            this.trigger( "pickerselect", {
                row: row,
                col: col
            } );

        },

        __update: function ( row, col ) {

            var tr = null,
                rowCount = this.__options.row,
                colCount = this.__options.col,
                className = CONF.classPrefix + 'table-picker-hoverin';

            for ( var i = 0; i < rowCount; i++ ) {

                tr = this.__backplane.rows[ i ];

                for ( var j = 0; j < colCount; j++ ) {

                    if ( i <= row && j <= col ) {
                        tr.cells[ j ].className = className;
                    } else {
                        tr.cells[ j ].className = "";
                    }

                }

            }

            this.trigger( "pickerhover", {
                row: row,
                col: col
            } );

        },

        __createBackplane: function () {

            var tpl = [],
                tmp = null;

            for ( var i = 0, len = this.__options.row; i < len; i++ ) {

                tmp = [];

                for ( var j = 0, jlen = this.__options.col; j < jlen; j++ ) {
                    tmp.push( '<td data-index="'+ i + ',' + j +'"></td>' );
                }

                tpl.push( '<tr>' + tmp.join( '' ) + '</tr>' );

            }

            tpl = $( '<table><tbody>' + tpl.join( '' ) + '</tbody></table>' );

            tpl.addClass( CONF.classPrefix + 't-picker-table' );

            return tpl[ 0 ];

        }

    } );

} );