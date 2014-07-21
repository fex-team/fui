define( function () {
return '<div unselectable="on" class="fui-colorpicker-container">' +
'<div unselectable="on" class="fui-colorpicker-toolbar">' +
'<div unselectable="on" class="fui-colorpicker-preview"></div>' +
'<div unselectable="on" class="fui-colorpicker-clear">@m.clearText</div>' +
'</div>' +
'<div unselectable="on" class="fui-colorpicker-title">@m.commonText</div>' +
'<div unselectable="on" class="fui-colorpicker-commoncolor">' +
'@m.commonColor.forEach(function(colors, i){' +
'<div unselectable="on" class="fui-colorpicker-colors fui-colorpicker-colors-line@i">' +
'@colors.forEach(function(color){' +
'<span unselectable="on" class="fui-colorpicker-item" style="background-color: @color; border-color: @(color.toLowerCase() == \'#ffffff\' ? \'#eeeeee\':color);" data-color="@color"></span>' +
'})' +
'</div>' +
'})' +
'</div>' +
'<div unselectable="on" class="fui-colorpicker-title">@m.standardText</div>' +
'<div unselectable="on" class="fui-colorpicker-standardcolor fui-colorpicker-colors">' +
'@m.standardColor.forEach(function(color){' +
'<span unselectable="on" class="fui-colorpicker-item" style="background-color: @color; border-color: @color;" data-color="@color"></span>' +
'})' +
'</div>' +
'</div>'
} );