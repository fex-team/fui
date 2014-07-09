define( function () {
return '<input unselectable="on" class="fui-input" @h.toCssText( m.__css ) autocomplete="off" @( m.text ? \'title="\' + m.text + \'"\' : \'\' ) @( m.value ? \'value="\' + m.value + \'"\' : \'\')>'
} );