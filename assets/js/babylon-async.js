/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Dato útil: ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Vector3 => ( x, y, z );

const CAMERA = new BABYLON.ArcRotateCamera(
    "camera",                 // Nombre de la cámara
    Math.PI / 2,             // Alpha - eje X
    Math.PI / 4,             // Beta - eje Y: [0 - PI]
                                0: desde arriba;
                                PI/2: vista de frente;
                                PI: vista desde abajo

    10,                       // Radio - Define la distancia de la camara desde el eje del modelo
    new BABYLON.Vector3(0, 0, 0), // Objetivo
    SCENE                     // Escena
);

SCENE.animationGroups[x].play(true);
*/
const INFORMACION_MODELOS = {
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
var POSICIONES_PERSONAJES = [0,1,-1,2,-2,3,-3];

const CANVAS = document.getElementById("renderCanvas");
const ENGINE = new BABYLON.Engine(CANVAS, true);
const SCENE = new BABYLON.Scene(ENGINE);

// Crea una cámara
/*
BABYLON.ArcRotateCamera
Órbita alrededor de un Objetivo:
La ArcRotateCamera está diseñada para orbitar
alrededor de un punto específico en la escena.
Permite al usuario rotar la cámara horizontal y verticalmente
alrededor de un objeto o punto de interés,
manteniendo siempre el enfoque en ese objetivo.

const CAMERA = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI * 2/4,
    Math.PI * 1/2,
    MODELO_EN_USO.distacia_focal,
    BABYLON.Vector3(0,0,0),
    SCENE
);
*/
const CAMERA = new BABYLON.FreeCamera(
    "camaraLibre",
    new BABYLON.Vector3(0, 0, -10),
    SCENE
);

// controles de la camara "true"-"false"
CAMERA.attachControl(CANVAS, false);

// Agregar foco de luz
const FOCO_DE_LUZ = new BABYLON.HemisphericLight("light",
                            new BABYLON.Vector3(1, 1, 0), // de donde viene la luz
                            SCENE);

// Color de fondo ( R, G, B ) / R,G,B : [0,1]
SCENE.clearColor = new BABYLON.Color3( 1, 0.5, 0 );

function definirLapsoAnimaciones(animaciones, nombreModelo) {
//    console.log("ANIMACIONES PRESENTES:");
//    console.log(`Modelo: ${nombreModelo}`);
    if ( animaciones.length == 0 ){
//        console.log(`~~~~~ Ninguna :(`);
        return;
    }

    let intervalo = 0;
    animaciones.forEach(animacion => {
        animacion.from = intervalo;
        intervalo = animacion.to;
        let info_animacion = {
            nombre : animacion.name,
            inicio : animacion.from,
            termino : animacion.to
        }
//        console.table( info_animacion );
        INFORMACION_MODELOS[nombreModelo].animaciones.push(info_animacion);
    });
}

function mostrarAnimacionesPresentes() {
    SCENE.animationGroups.forEach(animacion => {
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

    INFORMACION_MODELOS[modelo.name].alturaReal = Math.round (Math.abs( max - min) * 100 ) / 100; // Round 2 decimals
}

function distanciaCamara() {
    let base = ( Object.keys( INFORMACION_MODELOS ).length + 2 ) * 10;
    let anguloCamara = CAMERA.fov; // en Radianes
    
    let ladoA = ( base / 2 ) / Math.sin( anguloCamara / 2 );

    let distancia_SQRT = Math.sqrt( Math.pow( ladoA, 2 ) - Math.pow( base/2, 2 ) ) ;

    console.table({
        "base" : base,
        "anguloCamaraRadian" : anguloCamara,
        "ladoA" : ladoA,
        "distancia_SQRT" : distancia_SQRT
    });

    return distancia_SQRT * -1;
}

function enfocarCamaraLibre( ejeY ) {
    let ejeX = 0;
    ejeY /= 2;
    // 'ejeZ' necesita calcularse según el ancho de pantalla para que se vean todos los modelos
    let ejeZ = distanciaCamara();

    if ( Object.keys( INFORMACION_MODELOS ).length % 2 == 0 ){
        ejeX = 5;
    }
    const center = new BABYLON.Vector3(
        ejeX,
        ejeY,
        ejeZ
    );
//    console.log(`Centro: ${center}`);
    CAMERA.position = center;
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
    CAMERA.setTarget(center);
}

function definirTamanoModelo( nombreModelo, alturaObjetiva) {
    //SCENE.meshes[0].scaling = new BABYLON.Vector3(escala, escala, escala);
//    console.log( SCENE.getMeshByName(nombreModelo) );
    let escala = (alturaObjetiva / INFORMACION_MODELOS[nombreModelo].alturaReal) * INFORMACION_MODELOS[nombreModelo].alturaVisual;
    SCENE.getMeshByName(nombreModelo).scaling = new BABYLON.Vector3(escala, escala, escala);
}

function cargarPersonaje( modeloParaCargar ) {
    // carga de modelo ASYNCrona
    BABYLON.SceneLoader.ImportMeshAsync("", "./assets/models/", modeloParaCargar.nombre+".gltf", SCENE)
        .then((result) => {
            const animacionesDelModelo = result.animationGroups;
            // Asigna la primera malla cargada a la variable 'modelo'
            result.meshes[0].computeWorldMatrix(true);
            result.meshes[0].name = modeloParaCargar.nombre;
            result.meshes[0].position.x = 10 * POSICIONES_PERSONAJES.shift();

            //centrarFocoCamara(result.meshes[0]);
            calcularAlturaModelo(result.meshes[0]);

            // definirLapsoAnimaciones(result.meshes[0].SCENE.animationGroups, modeloParaCargar.nombre);
            definirLapsoAnimaciones(animacionesDelModelo, modeloParaCargar.nombre);
            // eliminar animaciones para que no se acumulen
            // y reasignarlas ordenadamente

            })
        .catch((error) => {
            console.error("Error al cargar el modelo UnU:", error);
        });
}

function mayorAlturaModelos( ) {
    let mayorAltura = 0.0;
    Object.values(INFORMACION_MODELOS).forEach( modelo => {
        if ( modelo.alturaReal > mayorAltura ){
            mayorAltura = modelo.alturaReal;
        }
    } );
    return mayorAltura;
}

function promedioAlturaModelos( ) {
    let promedioAltura = 0.0;
    Object.values(INFORMACION_MODELOS).forEach( modelo => {
        promedioAltura += modelo.alturaReal;
    } );
    promedioAltura /= Object.keys( INFORMACION_MODELOS ).length;
//    console.log(`Promedio: ${promedioAltura}`);
    return promedioAltura;
}

function normalizarAlturas() {
//    let alturaObjetiva = mayorAlturaModelos( );
    let alturaObjetiva = promedioAlturaModelos( );
    Object.values(INFORMACION_MODELOS).forEach( modelo => {
        definirTamanoModelo( modelo.nombre, alturaObjetiva );
    } );
    enfocarCamaraLibre( alturaObjetiva );
}

function mostrarPersonajes() {
    Object.values(INFORMACION_MODELOS).forEach( modelo => {
        cargarPersonaje( modelo );
    });
    //normalizarAlturas();
}

ENGINE.runRenderLoop(function() {
    SCENE.render();
    //console.log("SCENE Rendered");
});

// Ajustar el tamaño del canvas al redimensionar la ventana
window.addEventListener('resize', function() {
    ENGINE.resize();
    // console.log("resized");
});

mostrarPersonajes();