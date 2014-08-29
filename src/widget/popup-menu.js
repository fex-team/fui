define( function ( require ) {
     
    var Utils = require( "base/utils" ),
        CONF = require( "base/sysconf" ),
        $ = require( "base/jquery" ),
        Menu = require( "widget/menu" );

    return Utils.createClass( "PopupMenu", {

        base: require( "widget/popup" ),

        constructor: function( options ) {

            this.callBase( $.extend( {
                menu: {}
            }, options ) );
            
        },

        getMenuWidget: function() {
            return this.__menuWidget;
        },

        __initOptions: function() {

            this.callBase();

            this.widgetName = "PopupMenu";

        },

        __render: function() {

            this.callBase();

            this.__menuWidget = new Menu();

            this.appendWidget( this.__menuWidget );

            $( this.__element ).addClass( CONF.classPrefix + "popup-menu" );

        }


    });
});