/**
 * 模块暴露
 */
define( function ( require ) {

    var FUI_NS = require( "base/ns" );

    FUI_NS.___register( {

        Widget: require( "widget/widget" ),

        Icon: require( "widget/icon" ),
        Label: require( "widget/label" ),
        Button: require( "widget/button" ),
        ToggleButton: require( "widget/toggle-button" ),
        Buttonset: require( "widget/button-set" ),
        Separator: require( "widget/separator" ),
        Item: require( "widget/item" ),
        Input: require( "widget/input" ),
        InputButton: require( "widget/input-button" ),
        Mask: require( "widget/mask" ),
        ColorPicker: require( "widget/colorpicker" ),
        Tabs: require( "widget/tabs" ),
        SpinButton: require( "widget/spin-button" ),

        Container: require( "widget/container" ),
        Panel: require( "widget/panel" ),
        PPanel: require( "widget/ppanel" ),
        LabelPanel: require( "widget/label-panel" ),
        Menu: require( "widget/menu" ),
        InputMenu: require( "widget/input-menu" ),
        ButtonMenu: require( "widget/button-menu" ),
        DropPanel: require( "widget/drop-panel" ),
        Popup: require( "widget/popup" ),
        Dialog: require( "widget/dialog" ),

        Utils: require( "base/utils" ),
        Creator: require( "base/creator" )

    } );

    FUI_NS.__export();

} );