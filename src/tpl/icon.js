define( function () {
return '<div unselectable="on" class="fui-icon" @h.toCssText( m.__css )>' +
'@if ( m.img ) {' +
'<img unselectable="on" src="@m.img" @h.toCssText( m.__css )>' +
'}' +
'</div>'
} );