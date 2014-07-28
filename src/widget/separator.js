/**
 * Separator(分隔符) Widget
 */

define( function ( require ) {

    var Utils = require( "base/utils" ),
        separatorTpl = require( "tpl/separator" ),
        $ = require( "base/jquery" );

    return Utils.createClass( "Separator", {

        base: require( "widget/widget" ),

        constructor: function ( options ) {

            var defaultOptions = {
                width: 1,
                height: '100%',
                bgcolor: '#e1e1e1'
            };

            options = $.extend( {}, defaultOptions, options );

            this.callBase( options );

        },

        __initOptions: function () {

            this.callBase();

            this.widgetName = 'Separator';
            this.__tpl = separatorTpl;

        }

    } );
} );
