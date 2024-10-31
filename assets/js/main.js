// ready() nos asegura que se inicie el código solo tras cargarse el HTML completo
// importante para asignar capturar los elemenntos del DOM
$(document).ready(function(){
    const caja = document.getElementById("caja");
    const contenido = document.getElementById("contenido");
    const BTN_PAD = document.querySelectorAll(".btn-pad");
    // querySelectorAll nos entrega un arreglo de elementos que compartan el parametro enviado
    // usa nomenclatura de CSS
    // #pad -> id="pad"
    // .btn -> class="btn"
    // <nombre de un tag> -> <footer>

    
//  $(contenido).css("bottom", "0");
// así para editar el CSS - intercambiable con add/remove Class según sea necesario
    function moveanimado( que_muevo, x_axis = 0, y_axis = 0 ) {
        // se usan las coordenadas recibidas para iniciar una animacion de arrastre suave
        //si no se reciben coordennadas en los parametros se vuelve al origen [0,0]
        $(que_muevo).animate({
            left: x_axis,
            bottom: y_axis
        });
    }
    
    function sacar_contenido( x , y){
        // se usan los parametros como coordenadas cartesianas X , Y
        moveanimado(contenido, x, y);
    }

    $(BTN_PAD).click(function(){
        // al hacer click en el boton se extra la info en el tag "value" y se usan como parametros ded movimiento
        let a = $(this)[0].value.split(" ");
        console.log(a[0], a[1]);
        sacar_contenido(a[0], a[1]);
    });

});