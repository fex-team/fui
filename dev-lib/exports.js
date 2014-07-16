/**
 * 模块暴露
 */

define( 'fui.export', function ( require ) {

    window.FUI = {

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

        Container: require( "widget/container" ),
        Panel: require( "widget/panel" ),
        PPanel: require( "widget/ppanel" ),
        LabelPanel: require( "widget/label-panel" ),
        Menu: require( "widget/menu" ),
        InputMenu: require( "widget/input-menu" ),
        ButtonMenu: require( "widget/button-menu" ),
        DropPanel: require( "widget/drop-panel" ),
        Dialog: require( "widget/dialog" ),

        Utils: require( "base/utils" )

    };

} );