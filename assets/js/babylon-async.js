/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dato útil: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Vector3 => ( x, y, z );

const camera = new BABYLON.ArcRotateCamera(
    "camera",                 // Nombre de la cámara
    Math.PI / 2,             // Alpha - eje X
    Math.PI / 4,             // Beta - eje Y: [0 - PI]
                                0: desde arriba;
                                PI/2: vista de frente;
                                PI: vista desde abajo

    10,                       // Radio - Define la distancia de la camara desde el eje del modelo
    new BABYLON.Vector3(0, 0, 0), // Objetivo
    scene                     // Escena
);
*/
const info_modelos = {
    garlic : {
        nombre: "Garlic",
        distacia_focal: 40
    },
    pikasaur : {
        nombre: "Pikasaur",
        distacia_focal: 1000
    }
}

const modelo_en_uso = info_modelos.garlic;
//const modelo_en_uso = info_modelos.pikasaur;

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Crea una cámara
/*
BABYLON.ArcRotateCamera
Órbita alrededor de un Objetivo:
La ArcRotateCamera está diseñada para orbitar
alrededor de un punto específico en la escena.
Permite al usuario rotar la cámara horizontal y verticalmente
alrededor de un objeto o punto de interés,
manteniendo siempre el enfoque en ese objetivo.
*/
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI * 2/4,
    Math.PI * 1/2,
    modelo_en_uso.distacia_focal,
    BABYLON.Vector3(0,0,0),
    scene
);
// controles de la camara "true"-"false"
camera.attachControl(canvas, true);

// Agregar foco de luz
const light = new BABYLON.HemisphericLight("light",
                            new BABYLON.Vector3(1, 1, 0), // de donde viene la luz
                            scene);

// Define la variable para almacenar el modelo
let modelo = null;

// Color de fondo ( R, G, B ) / R,G,B : [0,1]
scene.clearColor = new BABYLON.Color3( 1, 0.5, 0 );

// cargar de modelo ASYNCrona
BABYLON.SceneLoader.ImportMeshAsync("", "/assets/models/", modelo_en_uso.nombre+".gltf", scene)
    .then((result) => {
        // Asigna la primera malla cargada a la variable 'modelo'
        modelo = result.meshes[0]; // Puedes ajustar el índice si hay múltiples mallas

        // Obtener información de los límites y calcular el centro
        const boundingInfo = modelo.getBoundingInfo();
        const center = boundingInfo.boundingBox.center;
        console.log("dimensiones", boundingInfo.boundingBox.minimum);
        console.log("dimensiones", boundingInfo.boundingBox.maximum);

        // Muestra el centro en consola
        // console.log("Centro del modelo:", center);
        // averiguar si tiene que ver con la exportación del modelo el por qué define el centro en 0,0,0

// Opcional: Ajustar la posición de la cámara al centro del modelo
        //camera.setTarget(center);

    })
    .catch((error) => {
        console.error("Error al cargar el modelo UnU:", error);
    }
);

engine.runRenderLoop(function() {
    scene.render();
    console.log();
});

// Ajustar el tamaño del canvas al redimensionar la ventana
window.addEventListener('resize', function() {
    // console.log("resized");
    engine.resize();
});