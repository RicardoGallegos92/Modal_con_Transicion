$(document).ready(function(){
    const caja = document.getElementById("caja");
    const contenido = document.getElementById("contenido");
    const BTN_CENTRAR = document.getElementById("Centrar");
    const BTN_SACAR = document.getElementById("Sacar");
    const BTN_PAD = document.querySelectorAll(".btn-pad");
//    $(caja).attr("","");
// $(contenido).css("bottom", "0");

/*     function movemodule( que_muevo, x_axis = 0, y_axis = 0 ){
        $(que_muevo).css("left", x_axis);
        $(que_muevo).css("bottom", y_axis);
    } */

    function moveanimado( que_muevo, x_axis = 0, y_axis = 0 ) {
        $(que_muevo).animate({
            left: x_axis,
            bottom: y_axis
        });
    }

/*     function centrar_contenido(){
        //movemodule(contenido);
        moveanimado(contenido)
    } */
    
    function sacar_contenido( x , y){
        //movemodule(contenido, "-50%", "-50%");
        moveanimado(contenido, x, y);
    }

/*     $(BTN_CENTRAR).click(function(){
        centrar_contenido();
    });
    
    $(BTN_SACAR).click(function(){
        sacar_contenido();
    }); */
    
    $(BTN_PAD).click(function(){
        let a = $(this)[0].value.split(" ");
        console.log(a[0], a[1]);
        sacar_contenido(a[0], a[1]);
    });

});