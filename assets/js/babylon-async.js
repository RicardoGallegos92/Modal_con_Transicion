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

scene.animationGroups[x].play(true);
*/
const info_modelos = {
    orak: {
        nombre: "orak",
        distacia_focal: 5
    },
    zombie :{
        nombre: "zombie",
        distacia_focal: 75
    },
    boy :{
        nombre: "boy",
        distacia_focal: 250
    },
    garlic : {
        nombre: "Garlic",
        distacia_focal: 40
    },
    pikasaur : {
        nombre: "Pikasaur",
        distacia_focal: 800
    }
}

const modelo_en_uso = info_modelos.zombie;
// const modelo_en_uso = info_modelos.orak;

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

function definirLapsoAnimaciones(animaciones) {
    console.log("ANIMACIONES PRESENTES:");
    let from_next = 0;
    animaciones.forEach(animacion => {
        animacion._from = from_next;
        from_next = animacion._to;
        console.table(
            {
                nombre : animacion.name,
                inicio : animacion._from,
                termino : animacion._to
            }
        );
    });
}

function mostrarAnimacionesPresentes() {
    /*
    scene.animationGroups.forEach(animacion => {
        console.log(animacion.name);
    });
    */
    definirLapsoAnimaciones(scene.animationGroups);
}

// DEPRECATED, solo devuelve 0's
function mostrarBoundingBox(infoDelModelo) {
    const center = infoDelModelo.boundingBox.center;
// Muestra el centro en consola
    console.log("Centro del modelo:", center);
// averiguar si tiene que ver con la exportación del modelo el por qué define todo en 0,0,0

    const min = infoDelModelo.boundingBox.minimum; // Coordenadas mínimas
    const max = infoDelModelo.boundingBox.maximum; // Coordenadas máximas
    console.table("minimos:");
    console.table(min);
    console.table("maximos:");
    console.table(max);
}

function centrarFocoCamara(boundingVectors) {
    const min = boundingVectors.min; // Coordenadas mínimas
    const max = boundingVectors.max; // Coordenadas máximas

    console.log("MODELO 3D");
    console.log("MINIMOS:");
    console.table(min);
    console.log("MAXIMOS:");
    console.table(max);

    const center = new BABYLON.Vector3(
                                (min.x + max.x )/2,
                                (min.y + max.y )/2,
                                (min.z + max.z )/2
                            );
// Opcional: Ajustar la posición de la cámara al centro del modelo
    camera.setTarget(center);
}

// cargar de modelo ASYNCrona
BABYLON.SceneLoader.ImportMeshAsync("", "/assets/models/", modelo_en_uso.nombre+".gltf", scene)
    .then((result) => {
        // Asigna la primera malla cargada a la variable 'modelo'
        modelo = result.meshes[0]; // Puedes ajustar el índice si hay múltiples mallas
        
        modelo.computeWorldMatrix(true);

        // mostrarBoundingBox(modelo.getBoundingInfo());

        centrarFocoCamara(modelo.getHierarchyBoundingVectors());

        mostrarAnimacionesPresentes();

        })
        .catch((error) => {
            console.error("Error al cargar el modelo UnU:", error);
        });

engine.runRenderLoop(function() {
    scene.render();
    console.log();
});

// Ajustar el tamaño del canvas al redimensionar la ventana
window.addEventListener('resize', function() {
    // console.log("resized");
    engine.resize();
});
