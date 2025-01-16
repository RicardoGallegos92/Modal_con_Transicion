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
        distacia_focal: 5,
        animaciones : [],
        alturaVisual : 1.0,
        alturaReal : null
    },
    zombie :{
        nombre: "zombie",
        distacia_focal: 75,
        animaciones : [],
        alturaVisual : 0.7,
        alturaReal : null
    },
    garlic : {
        nombre: "garlic",
        distacia_focal: 40,
        animaciones : [],
        alturaVisual : 0.5,
        alturaReal : null
    },
    oiiaCat : {
        nombre: "oiiaCat",
        distacia_focal: 5,
        animaciones : [],
        alturaVisual : 0.2,
        alturaReal : null
    }
}
var posicionesPersonajes = [0,1,-1,2,-2,3,-3];

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

const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI * 2/4,
    Math.PI * 1/2,
    MODELO_EN_USO.distacia_focal,
    BABYLON.Vector3(0,0,0),
    scene
);
*/
const camera = new BABYLON.FreeCamera(
    "camaraLibre",
    new BABYLON.Vector3(0, 0, -10),
    scene
);

// controles de la camara "true"-"false"
camera.attachControl(canvas, false);

// Agregar foco de luz
const light = new BABYLON.HemisphericLight("light",
                            new BABYLON.Vector3(1, 1, 0), // de donde viene la luz
                            scene);

// Color de fondo ( R, G, B ) / R,G,B : [0,1]
scene.clearColor = new BABYLON.Color3( 1, 0.5, 0 );

function definirLapsoAnimaciones(animaciones, nombreModelo) {
/*
    console.log("ANIMACIONES PRESENTES:");
    console.log("Modelo: " + nombreModelo);
*/
    let from_next = 0;
    animaciones.forEach(animacion => {
        animacion._from = from_next;
        from_next = animacion._to;
        let info_animacion = {
            nombre : animacion.name,
            inicio : animacion._from,
            termino : animacion._to
        }
        console.table( info_animacion );

        info_modelos[nombreModelo].animaciones.push(info_animacion);
    });
}

function mostrarAnimacionesPresentes() {
    scene.animationGroups.forEach(animacion => {
        console.log(animacion.name);
    });
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

function calcularAlturaModelo(modelo) {
    let boundingVectors = modelo.getHierarchyBoundingVectors()
    let min = boundingVectors.min.y; // Coordenadas mínimas
    let max = boundingVectors.max.y; // Coordenadas máximas

    info_modelos[modelo.name].alturaReal = Math.abs( max - min);
}

function enfocarCamaraLibre( y ) {
    let x = 0;
    if ( posicionesPersonajes[0] < 0 ){
        x = 5;
    }
    const center = new BABYLON.Vector3(
        x,
        y / 2,
        -y * ( Object.keys( info_modelos ).length ) *.75
    );
    console.log(`Centro: ${center}`);
    camera.position = center;
}

function centrarFocoCamara(modelo) {
    let boundingVectors = modelo.getHierarchyBoundingVectors()
    const min = boundingVectors.min; // Coordenadas mínimas
    const max = boundingVectors.max; // Coordenadas máximas
/*
    console.log("MODELO 3D");
    console.log("MAXIMOS:");
    console.table(max);
    console.log("MINIMOS:");
    console.table(min);
*/
    const center = new BABYLON.Vector3(
                                ( min.x + max.x )/2,
                                ( min.y + max.y )/2,
                                ( min.z + max.z )/2
                            );
// Opcional: Ajustar la posición de la cámara al centro del modelo
    camera.setTarget(center);
}

function definirTamanoModelo( nombreModelo, alturaObjetiva) {
    //scene.meshes[0].scaling = new BABYLON.Vector3(escala, escala, escala);
    console.log( scene.getMeshByName(nombreModelo) );
    let escala = (alturaObjetiva / info_modelos[nombreModelo].alturaReal) * info_modelos[nombreModelo].alturaVisual;
    scene.getMeshByName(nombreModelo).scaling = new BABYLON.Vector3(escala, escala, escala);
}

function cargarPersonaje( modeloParaCargar ) {
    // carga de modelo ASYNCrona
    BABYLON.SceneLoader.ImportMeshAsync("", "./assets/models/", modeloParaCargar.nombre+".gltf", scene)
        .then((result) => {
            // Asigna la primera malla cargada a la variable 'modelo'
            result.meshes[0].computeWorldMatrix(true);
            result.meshes[0].name = modeloParaCargar.nombre;
            result.meshes[0].position.x = 10 * posicionesPersonajes.shift();

            //centrarFocoCamara(result.meshes[0]);
            calcularAlturaModelo(result.meshes[0]);

            console.log("scene.animationGroups");
            console.log(scene.animationGroups);
            definirLapsoAnimaciones(result.meshes[0]._scene.animationGroups, modeloParaCargar.nombre);
            // eliminar animaciones para que no se acumulen
            // y reasignarlas ordenadamente

            })
        .catch((error) => {
            console.error("Error al cargar el modelo UnU:", error);
        });
}

function mayorAlturaModelos( ) {
    let mayorAltura = 0.0;
    Object.values(info_modelos).forEach( modelo => {
        if ( modelo.alturaReal > mayorAltura ){
            mayorAltura = modelo.alturaReal;
        }
    } );
    return mayorAltura;
}

function promedioAlturaModelos( ) {
    let promedioAltura = 0.0;
    Object.values(info_modelos).forEach( modelo => {
        promedioAltura += modelo.alturaReal;
    } );
    promedioAltura /= Object.keys( info_modelos ).length;
    console.log(`Promedio: ${promedioAltura}`);
    return promedioAltura;
}

function normalizarAlturas() {
//    let alturaObjetiva = mayorAlturaModelos( );
    let alturaObjetiva = promedioAlturaModelos( );
    Object.values(info_modelos).forEach( modelo => {
        definirTamanoModelo( modelo.nombre, alturaObjetiva );
    } );
    enfocarCamaraLibre( alturaObjetiva );
}

function mostrarPersonajes() {
    Object.values(info_modelos).forEach( modelo => {
        cargarPersonaje( modelo );
    });
    //normalizarAlturas();
}

engine.runRenderLoop(function() {
    scene.render();
    //console.log("scene Rendered");
});

// Ajustar el tamaño del canvas al redimensionar la ventana
window.addEventListener('resize', function() {
    engine.resize();
    // console.log("resized");
});

mostrarPersonajes();