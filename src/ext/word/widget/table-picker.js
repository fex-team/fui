/**
 * Table选择器构件
 */

define( function ( require ) {

    var $ = require( "base/jquery" ),
        CONF = require( "base/sysconf" ),
        tpl = require( "ext/word/tpl/table-picker" ),
        Label = require( "widget/label" ),
        TPicker = require( "ext/word/widget/t-picker" ),
        Button = require( "widget/button" ),
        PPanel = require( "widget/ppanel" ),
        Mask = require( "widget/mask" );

    return require( "base/utils" ).createClass( "TablePicker", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                button: null,
                row: 10,
                col: 10
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        open: function () {

            this.__panelWidget.show();
            this.__maskWidget.show();

        },

        close: function () {

            this.__panelWidget.hide();
            this.__maskWidget.hide();

        },

        // Overload
        appendTo: function ( container ) {

            container.appendChild( this.__buttonWidget.getElement() );

        },

        getButton: function () {
            return this.__buttonWidget;
        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'TablePicker';
            this.__tpl = tpl;

            this.__pickerWidget = null;
            this.__labelWidget = null;
            this.__buttonWidget = null;
            this.__panelWidget = null;
            this.__maskWidget = null;

        },

        __render: function () {

            this.callBase();

            this.__pickerWidget = new TPicker( this.__options );
            this.__labelWidget = new Label( {
                text: '插入表格'
            } );
            this.__buttonWidget = new Button( this.__options.button );
            this.__panelWidget = new PPanel( {
                className: CONF.classPrefix + 'table-picker-panel',
                column: true,
                resize: 'none'
            } );
            this.__maskWidget = new Mask();

            this.__panelWidget.appendWidget( this.__labelWidget );
            this.__panelWidget.appendWidget( this.__pickerWidget );

            this.__panelWidget.positionTo( this.__buttonWidget );

        },

        __initEvent: function () {

            var _self = this;

            this.callBase();

            this.__buttonWidget.on( 'btnclick', function ( e ) {

                _self.open();

            } );

            this.__maskWidget.on( 'maskclick', function ( e ) {

                _self.close();

            } );

            this.__pickerWidget.on( "pickerhover", function ( e, info ) {

                var row = info.row + 1,
                    col = info.col + 1;

                _self.__labelWidget.setText( row + 'x' + col + ' 表格' );

            } ).on( "pickerselect", function ( e, info ) {

                var row = info.row + 1,
                    col = info.col + 1;

                _self.close();
                _self.trigger( "pickerselect", {
                    row: row,
                    col: col
                } );

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