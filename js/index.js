import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols'
import { randomMaterials } from './cubematerials'
import { setTextLabel } from './drawlabel'

/*
 * Create scene
 * */
const scene = new THREE.Scene();
const VIEW_ANGLE = 60;
const FAR = 100;
const camera = new THREE.PerspectiveCamera( VIEW_ANGLE, window.innerWidth/window.innerHeight, 0.1, FAR );

const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


/*
 * Create matrix of cubes
 * */

const SIZE_MATRIX = 5;
const STEP = 1;
const EDGE = 1;
const FOURTH_EDGE = EDGE * .25
const startPosition = -(EDGE + SIZE_MATRIX * STEP) / 2

let geometry = new THREE.CubeGeometry(FOURTH_EDGE, FOURTH_EDGE, FOURTH_EDGE);

let numberOfCube = 1;

Array.from({ length: SIZE_MATRIX }, (buf, indexY) => {
    Array.from({ length: SIZE_MATRIX }, (buf, indexX) => {

        let cubeMaterials = randomMaterials()
        let cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
        let cube = new THREE.Mesh( geometry, cubeMaterial );

        scene.add( cube );

        cube.name = `thecube_${numberOfCube}`
        cube.position.x = startPosition + EDGE + indexX * STEP;
        cube.position.y = EDGE + indexY * STEP;
        cube.geometry.colorsNeedUpdate = true;
        numberOfCube += 1
    })
});

camera.position.z = STEP + EDGE;
camera.position.y = startPosition;

const mouse = new THREE.Vector2();
document.addEventListener( 'mousemove', onMouseMove, false );

function onMouseMove( event ) {

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


let controls = new TrackballControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
let intersects, INTERSECTED;

const render = function () {
    requestAnimationFrame(render);

    raycaster.setFromCamera( mouse, camera );
    intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length ) {
        const face = intersects[0].face;

        function checkNeedRender(intersect, currentIntersect, materialIndex) {
            if (intersect != currentIntersect ||
                intersect.materialIndex != materialIndex) {
                return true
            }
            return false
        }

        function keepIntersect(intersect, materialIndex) {
            INTERSECTED = intersect;
            INTERSECTED.materialIndex = materialIndex
            INTERSECTED.currentHex = INTERSECTED.material[materialIndex].color.getHex()
            INTERSECTED.material[materialIndex].color.setHex( 0xffffff )
        }

        if (INTERSECTED) {
            if (checkNeedRender(INTERSECTED, intersects[0].object, face.materialIndex)){

                INTERSECTED.material[INTERSECTED.materialIndex].color.setHex(INTERSECTED.currentHex)

                keepIntersect(intersects[0].object, face.materialIndex)
            }

        } else {
            keepIntersect(intersects[0].object, face.materialIndex)
        }

    } else {
        if (INTERSECTED) {
            INTERSECTED.material[INTERSECTED.materialIndex].color.setHex( INTERSECTED.currentHex );
            INTERSECTED = null
        }
    }

    controls.update();

    renderer.render(scene, camera);
};

render();


document.addEventListener( 'click', (ev) => {
    if (INTERSECTED) {
        let colorBuffer = INTERSECTED.currentHex.toString(16)
        colorBuffer = '#' + Array.from( {length: 6 - colorBuffer.length},
            () => { return '0' } ).join('') + colorBuffer;

        setTextLabel( `${INTERSECTED.name} <br/>${colorBuffer}`, colorBuffer)
    } else {
        setTextLabel('')
    }
}, false );