import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import TWEEN from '@tweenjs/tween.js'

import colors from './public/src/_colors.js'
import text from './public/src/text.js'
import ollie from './public/src/ollie.js'

// Colors
const { white, grayDark, gray, grayLight } = colors

// Text
const { textGroup, textAnimation } = text;

// Ollie
const { ollieGroup, table, tableBottom, ollieAnimation } = ollie;

let camera, scene, renderer, light, controls;
let raycaster, pointer;

const init = () => {
  if (WebGL.isWebGLAvailable()) {
    // Set Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(grayLight);

    // Set Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 0, 10); // TODO accomodate for mobile by zooming out
    camera.lookAt(0, 0, 0);

    // Set Lighting
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // Set Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);

    // Set Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    // clamping controls
    const rangeHor = Math.PI * 0.1;
    controls.minAzimuthAngle = -rangeHor;
    controls.maxAzimuthAngle = rangeHor;

    const rangeVer = Math.PI / 2;
    controls.minPolarAngle = rangeVer - .1;
    controls.maxPolarAngle = rangeVer + .1;

    // Set Raycasting
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    scene.add(textGroup, ollieGroup, table, tableBottom)

    // Shoot a raycast
    // window.addEventListener('click', onClick);
    // window.addEventListener('touchstart', onClick); // mobile

    // Handles resizing of window
    window.addEventListener('resize', onWindowResize);

  } else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);

  };
};

// Renders scene
const render = () => renderer.render(scene, camera);

// Update frames
const update = () => {
  requestAnimationFrame(update);
  controls.update()
  // Update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      // if(intersects[i].object.name === 'donutText') {
      //   loadDonut();
      // };

    };
    // Reset pointer
    pointer.x = null;
    pointer.y = null;
  }

  TWEEN.update();

  render()
};

const onWindowResize = (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

init(); // Initialize

// Needs to wait for fonts to load first, 1 second seems to suffice
// Always errors out unless it starts 5-6 frames after init
setTimeout(() => {
  textAnimation();
  ollieAnimation();
}, 1000);

update(); // Start update loop


// REFERENCES (remove later)

// const tween = () => {
//   new TWEEN.Tween(sceneCube.position)
//   .to(
//     {
//     y:1,
//     }, 5000
//   )
//   .delay(1000)
//   .easing(TWEEN.Easing.Cubic.Out)
//   .start()
//   .onComplete(() => {
//     new TWEEN.Tween(sceneCube.position)
//       .to(
//         {
//           y:0
//         }, 1000
//       )
//       .easing(TWEEN.Easing.Bounce.Out)
//       .start()
//   })
// }