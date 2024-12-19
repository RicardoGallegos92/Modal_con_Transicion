$(document).ready(function(){
    // Aquí definimos que vamos a detectar las teclas presionadas
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

    scene.actionManager.registerAction(
    // Detectar cualquier tecla presionada en el teclado
        new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnKeyUpTrigger,
            function (evt) {
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
                console.log("Se presionó tecla: ",
                            evt.sourceEvent.key,
                            evt.sourceEvent.keyCode,
                            evt.sourceEvent.charCode
                            );
            }
        )
    );
});
