import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import TWEEN from '@tweenjs/tween.js';

import colors from './public/src/_colors.js';
import projects from './public/src/_projects.js';
import textLoader from './public/src/textLoader.js';
import ollieLoader from './public/src/ollieLoader.js';
import bubbleLoader from './public/src/bubbleLoader.js';
import hamburgerLoader from './public/src/hamburgerLoader.js';
import animations from './public/src/animations.js';

// Colors
const { black, white, grayDark, gray, grayLight, red, blue, yellow } = colors;

// Text
const { textGroup } = textLoader;

// Ollie
const { ollieGroup, ollieLeftEye, ollieRightEye, table, tableBottom } = ollieLoader;

// Bubble
const { bubbles, BUBBLESCALE, populateBubbles } = bubbleLoader;

// Animation
const { introAnimation, bubbleClickAnimation, bubbleIdleAnimation, bubbleStateChangeAnimation, hamburgerClickAnimation,ollieBarkAnimation } = animations;

// Hamburger
const { hamburgerGroup } = hamburgerLoader;

// Object Colors
const sceneColor = grayLight;

let camera, aspectRatio;
let scene, renderer, light, controls;
let raycaster, pointer;

let previousBubble;

const CAMFOV = 60;

const init = () => {
  if (WebGL.isWebGLAvailable()) {
    // Set Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneColor);

    // Set Camera Properties
    aspectRatio = window.innerWidth / window.innerHeight;

    // Set Camera
    camera = new THREE.PerspectiveCamera(calculateFOV(), aspectRatio, 1, 5000);
    camera.position.set(0, 0, 10); // default position for window width of 1200 should be around 10
    camera.lookAt(0, 0, 0);

    // Set Lighting
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // Set Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);

    // Set Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Clamp controls
    const rangeHor = Math.PI * 0.1;
    controls.minAzimuthAngle = -rangeHor;
    controls.maxAzimuthAngle = rangeHor;

    const rangeVer = Math.PI / 2;
    controls.minPolarAngle = rangeVer - .1;
    controls.maxPolarAngle = rangeVer + .1;

    // Set Raycasting
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    populateBubbles(projects);
    scene.add(textGroup, ollieGroup, table, tableBottom, ...bubbles, hamburgerGroup);

    // Set event listeners
    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onClick); // mobile
    window.addEventListener('mousemove', onMouseMove)

    // Handles resizing of window
    window.addEventListener('resize', onWindowResize);

  } else {
    const warning = WebGL.getWebGLErrorMessage();
    document.body.appendChild(warning);

  };
};

// Renders scene
const render = () => renderer.render(scene, camera);

// Update frames
const update = () => {
  requestAnimationFrame(update);
  controls.update()
  TWEEN.update();

  render()
};

const onWindowResize = e => {
  aspectRatio = window.innerWidth / window.innerHeight
  camera.aspect = aspectRatio;

  camera.fov = calculateFOV();
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const calculateFOV = () => {
  // Formula to calculate a suitable FOV based on user's window size. 
  // The aspect ratio check is to see if we are accommodating for landscape or portrait view to fit the scene appropriately
  let camDistance = (aspectRatio <= 1.5 ? window.innerWidth : window.innerHeight * 1.5) / 2 / Math.tan(Math.PI * CAMFOV / 360);
  return 2 * Math.atan( (window.innerWidth / aspectRatio) / ( 2 * camDistance ) ) * ( 180 / Math.PI );
};

const updatePointer = e => {
  // check for click or touches
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  pointer.x = (x / window.innerWidth) * 2 - 1;
  pointer.y = - (y / window.innerHeight) * 2 + 1;
};

const shootRaycast = e => {
  updatePointer(e);
  // Update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);
  // Calculate objects intersecting the picking ray
  return raycaster.intersectObjects(scene.children);

};

const onClick = e => {
  const intersects = shootRaycast(e);

  // exit from portfolio mockups
  // check for this first because this is not a three.js object, thus does not require raycasting checks
  if(e.srcElement.className === 'exit'){
    bubbleStateChangeAnimation(previousBubble, false);

    // resume controls
    controls.enableDamping = true;
    controls.enabled = true;
  };

  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {

      // find out the parent (group) of object intersecting and also check if it is completely in view (animation completed)
      if(intersects[i].object.parent.name === 'bubble' && intersects[i].object.material.opacity >= 1) {
        // if the there is an enlarged bubble, and the currently clicked bubble isn't that one
        if(previousBubble && previousBubble != intersects[i].object.parent){
          bubbleClickAnimation(previousBubble, false);
        };
        // check if the last bubble is not the currently clicked on
        if(previousBubble != intersects[i].object.parent){
          previousBubble = intersects[i].object.parent;
          bubbleClickAnimation(previousBubble, true);
        };
        break;
      };

      // if a bubble is enlarged and after we iterate through all objects and none of the intersected objects are bubbles or we click on the hamburger, shrink it
      if(previousBubble && (i >= intersects.length - 1 || intersects[i].object.parent.iconType === 'hamburger')){
        bubbleClickAnimation(previousBubble, false);
        previousBubble = undefined;
      };
      
      if(intersects[i].object.parent.name === 'ollieBody'){
        ollieBarkAnimation(scene);
        break;
      };

      if(intersects[i].object.parent.name === 'icon' && intersects[i].object.material.opacity >= 1){
        // if user clicks on the magnifying glass, show portfolio mockups
        if(intersects[i].object.parent.iconType === 'portfolioMocks'){
          bubbleStateChangeAnimation(previousBubble, true);
          
          // user cannot change with controls while in this state 
          controls.enableDamping = false; // I have to disable damping before reseting/disable controls in the case of damping occuring when user clicks, it will finish the current damp before turning off otherwise
          controls.reset();
          controls.enabled = false;
        } else if(intersects[i].object.parent.iconType === 'hamburger'){ // clicking on hamburger icon
          hamburgerClickAnimation(intersects[i].object.parent);
        } else window.open(intersects[i].object.parent.link);
        break;
      };
    };

    // Reset pointer
    pointer.x = null;
    pointer.y = null;
  } else if(previousBubble) { // If we click somewhere that doesn't catch an object and we have a bubble enlarged, shrink it
      bubbleClickAnimation(previousBubble, false);
      previousBubble = undefined;

      // resume controls, in case the user clicks off the bubble during mock state
      controls.enableDamping = true;
      controls.enabled = true;
  };
};

const onMouseMove = e => {
  const intersects = shootRaycast(e);
  
  if (intersects.length > 0) {
    // only need to see the first intersected option to find out if it is an icon or not
      if(intersects[0].object.parent.name === 'icon' && intersects[0].object.material.opacity >= 1){
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = '';
      };
  } else document.body.style.cursor = '';
};

init(); // Initialize

// Needs to wait for fonts to load first, 1 second seems to suffice
// Always errors out unless it starts 5-6 frames after init
setTimeout(() => {
  introAnimation();
  bubbles.forEach(bubble => bubbleIdleAnimation(bubble))
}, 1000);

update(); // Start update loop