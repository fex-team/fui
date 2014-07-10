define( function () {
return '<input unselectable="on" class="fui-input" @h.toCssText( m.__css ) autocomplete="off" @( m.value ? \'value="\' + m.value + \'"\' : \'\')>'
} );