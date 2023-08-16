import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import TWEEN from '@tweenjs/tween.js'

import colors from './public/src/_colors.js'
import text from './public/src/text.js'
import ollie from './public/src/ollie.js'
import bubble from './public/src/bubble.js'
import animations from './public/src/animations.js'

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Text
const { textGroup } = text;

// Ollie
const { ollieGroup, table, tableBottom } = ollie;

// Bubble
const { bubbleGroup } = bubble;

// Animation
const { animation } = animations;

let camera, scene, renderer, light, controls;
let raycaster, pointer;

const init = () => {
  if (WebGL.isWebGLAvailable()) {
    // Set Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(grayLight);

    // Set Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 0, 120 / window.innerWidth * 100); // default position for window width of 1200 should be around 10
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

    scene.add(textGroup, ollieGroup, table, tableBottom, bubbleGroup)

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
  camera.position.z = 120 / window.innerWidth * 100;
  renderer.setSize(window.innerWidth, window.innerHeight);
};

init(); // Initialize

// Needs to wait for fonts to load first, 1 second seems to suffice
// Always errors out unless it starts 5-6 frames after init
setTimeout(() => {
  animation();
}, 1000);

update(); // Start update loop
