$(document).ready(function(){
    var INDEX_ANIMACION_ACTUAL = 0;

    const BTN_ANIMACION = document.querySelectorAll(".animationStart");

    function detenerAnimacion(animacion) {
        console.log("stop Animacion:", animacion.name);
        animacion.stop();
    }

    function iniciarAnimacion(animacion) {
        console.table("play Animacion:", animacion.name);
        animacion.play(true);
//        console.log(animacion);
    }

    function cambiarAnimacion( INDEX_ANIMACION_NUEVA ) {
        detenerAnimacion( scene.animationGroups[INDEX_ANIMACION_ACTUAL] );
        iniciarAnimacion( scene.animationGroups[INDEX_ANIMACION_NUEVA] );
        INDEX_ANIMACION_ACTUAL = INDEX_ANIMACION_NUEVA;
    }

    $(BTN_ANIMACION).click(function() {
        cambiarAnimacion(this.value);
    });

});