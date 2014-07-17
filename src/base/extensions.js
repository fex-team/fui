/**
 * 扩展模块暴露
 */
define( function ( require ) {

    var FUI_NS = require( "base/ns" );

    FUI_NS.___register( {

        TablePicker: require( "ext/word/widget/table-picker" )

    } );

} );