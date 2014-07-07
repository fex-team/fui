/**
 * 模块暴露
 */

define( 'kf.export', function ( require ) {

    window.FUI = {

        Widget: require( "widget/widget" ),

        Icon: require( "widget/icon" ),
        Label: require( "widget/label" ),
        Button: require( "widget/button" ),
        ToggleButton: require( "widget/toggle-button" )

    };

} );