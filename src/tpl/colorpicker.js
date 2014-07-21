define( function () {
return '<div unselectable="on" class="fui-colorpicker-container">\n' +
'<div unselectable="on" class="fui-colorpicker-toolbar">\n' +
'<div unselectable="on" class="fui-colorpicker-preview"></div>\n' +
'<div unselectable="on" class="fui-colorpicker-clear">$clearText</div>\n' +
'</div>\n' +
'<div unselectable="on" class="fui-colorpicker-title">$commonText</div>\n' +
'<div unselectable="on" class="fui-colorpicker-commoncolor">\n' +
'helper.forEach( commonColor, function ( index, colors ) {\n' +
'<div unselectable="on" class="fui-colorpicker-colors fui-colorpicker-colors-line$index">\n' +
'helper.forEach( colors, function( i, color ) {\n' +
'<span unselectable="on" class="fui-colorpicker-item" style="background-color: $color; border-color: #{color.toLowerCase() == \'#ffffff\' ? \'#eeeeee\': color};" data-color="$color"></span>\n' +
'});\n' +
'</div>\n' +
'} );\n' +
'</div>\n' +
'<div unselectable="on" class="fui-colorpicker-title">$standardText</div>\n' +
'<div unselectable="on" class="fui-colorpicker-standardcolor fui-colorpicker-colors">\n' +
'helper.forEach( standardColor, function ( i, color ) {\n' +
'<span unselectable="on" class="fui-colorpicker-item" style="background-color: $color; border-color: $color;" data-color="$color"></span>\n' +
'} );\n' +
'</div>\n' +
'</div>\n'
} );