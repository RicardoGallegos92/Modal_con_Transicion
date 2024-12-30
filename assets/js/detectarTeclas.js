$(document).ready(function(){
    // Aquí definimos que vamos a detectar las teclas presionadas
    var ESTA_MOVIENDOSE = false;
    scene.actionManager = new BABYLON.ActionManager(scene);
/*
    scene.actionManager.registerAction(
// El uso de "parameter" nos permite detectar una tecla específica
// y asignarle una funcion
        new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnKeyUpTrigger,
                parameter: "r",
            },
            function () {
                console.log("r button was pressed");
            }
        )
    );
*/

    function accionTeclaPresionada( teclaPresionada ) {
        switch ( teclaPresionada ) {
            case 'w':
            case 'a':
            case 's':
            case 'd':
                if ( !ESTA_MOVIENDOSE ){
                    console.log("Walk");
                    //iniciarAnimacion();
                    ESTA_MOVIENDOSE = true;
                }
                break;
        }
    }

    function accionTeclaSoltada( teclaSoltada ) {
        if ( ESTA_MOVIENDOSE ){
            console.log("idle");
            //detenerAnimacion();
            ESTA_MOVIENDOSE = false;
        }
    }

    scene.actionManager.registerAction(
    // Detectar cualquier tecla presionada en el teclado
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnKeyUpTrigger,
            function (evt) {
                accionTeclaSoltada(evt.sourceEvent.key);
                console.log("Se soltó tecla:",
                            evt.sourceEvent.key,
                            evt.sourceEvent.keyCode,
                            evt.sourceEvent.charCode
                            );
            }
        )
    );

    scene.actionManager.registerAction(
    // Detectar cualquier tecla al soltarla
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnKeyDownTrigger,
            function (evt) {
                accionTeclaPresionada(evt.sourceEvent.key);
                console.log("Se presionó tecla: ",
                            evt.sourceEvent.key,
                            evt.sourceEvent.keyCode,
                            evt.sourceEvent.charCode
                            );
            }
        )
    );
});
