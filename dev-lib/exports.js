/**
 * 模块暴露
 */

define( 'kf.export', function ( require ) {

    window.FUI = {

        Widget: require( "widget/widget" ),

        Icon: require( "widget/icon" ),
        Label: require( "widget/label" ),
        Button: require( "widget/button" ),
        ToggleButton: require( "widget/toggle-button" ),
        Buttonset: require( "widget/button-set" ),
        Separator: require( "widget/separator" ),

        Container: require( "widget/container" ),
        Panel: require( "widget/panel" ),
        LabelPanel: require( "widget/label-panel" )

    };

} );