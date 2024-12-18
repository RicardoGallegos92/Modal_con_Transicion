const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

const createScene = function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    
// Crea una cámara
    const camera = new BABYLON.FreeCamera(
                                "camera1",
                                new BABYLON.Vector3(0, 5, 10),
                                scene
                            );
/*
BABYLON.FreeCamera
Movimiento Libre:
    La FreeCamera permite a los usuarios navegar por la escena
    sin restricciones, similar a un juego en primera persona.
    Los usuarios pueden moverse en cualquier dirección
    (adelante, atrás, izquierda, derecha)
    y mirar alrededor utilizando el mouse o el teclado.
*/
    // Conectar controles al canvas
    camera.attachControl(canvas, true);

    // Targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Creates a light, aiming 0,1,0 - to the sky
    const light = new BABYLON.HemisphericLight("light", 
        new BABYLON.Vector3(0, 1, 0), scene);
    
    // Dim the light a small amount - 0 to 1
    light.intensity = 0.7;
    
    // Carga tu modelo aquí
    const modelo = BABYLON.SceneLoader.Append("/assets/models/Garlic.gltf", "", scene, function () {
        console.log("Modelo cargado");
    });
    
    scene.useRightHandedSystem = true;
/*
// EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR
// Babylon
    BABYLON.SceneLoader.Load("/assets/models/test.babylon", "", scene, function (scene) {
        console.log("Modelo cargado");
    });
    // EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR EEROR
*/

/*
// --------------------------------- EXAMPLE -----------------------------------
    // Built-in 'sphere' shape.
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Built-in 'ground' shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);
    // ------------------------------------------------------------------------------------------
*/
    
    return scene;
};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});