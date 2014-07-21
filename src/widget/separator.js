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

            var marker = Utils.getMarker();
            this.callBase( marker );

            var defaultOptions = {
                width: 1,
                height: '100%',
                bgcolor: '#e1e1e1'
            };

            this.__extendOptions( defaultOptions, options );

            this.widgetName = 'Separator';
            this.__tpl = separatorTpl;

            if ( options !== marker ) {
                this.__render();
            }

        }

    } );
} );
