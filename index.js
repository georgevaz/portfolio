import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import TWEEN from '@tweenjs/tween.js';

import { black, grayDark, gray, red, cream } from './public/src/_colors.js';
import projects from './public/src/_projects.js';
import { textGroup, loadStartingText } from './public/src/createText.js';
import { Ollie } from './public/src/ollie.js';
import { BUBBLESCALE, loadBubble } from './public/src/bubble.js';
import { Hamburger } from './public/src/hamburger.js';
import { 
  introAnimation, 
  bubbleClickAnimation, 
  bubbleStateChangeAnimation, 
  hamburgerClickAnimation,
  iconHoverAnimation,
  ollieBarkAnimation } from './public/src/animations.js';

// Object Colors
const sceneColor = cream;

let camera, aspectRatio;
let scene, renderer, light, controls;
let raycaster, pointer;

let previousBubble;
const bubbles = [];

let hoverObject;
let currentHoverIcon = {
  object: undefined,
  isHovered: false
};

const CAMFOV = 60;

// Object classes
const hamburger = new Hamburger();
const ollie = new Ollie();

// Mobile Safari doesn't open external tabs/windows. Doing a check to see if user is on Safari via mobile device
const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isSafari = /Safari/.test(navigator.userAgent);

const init = async () => {
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

    // Create Models
    await loadStartingText();
    await ollie.loadOllie();
    await hamburger.loadHamburgerIcons();
    await populateBubbles(projects);
    
    scene.add(textGroup, ollie.ollieGroup, ollie.table, ollie.tableBottom, ...bubbles, hamburger.hamburgerGroup);

    // Set event listeners
    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onClick); // mobile
    window.addEventListener('mousemove', onMouseMove)

    // Handles resizing of window
    window.addEventListener('resize', onWindowResize);

    introAnimation(hamburger.hamburgerGroup, ollie, bubbles);

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

  if(intersects.length > 0){
    for(let i = 0; i < intersects.length; i++){

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
        } else {
          isMobileDevice && isSafari ? window.location.href = intersects[i].object.parent.link : window.open(intersects[i].object.parent.link);
        }
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

  ollie.moveEyes(pointer);

  if(intersects.length > 0){
    // only need to see the first intersected option
    hoverObject = intersects[0].object;

    // change cursor to pointer
    for(let i = 0; i < intersects.length; i++){
      if(
        ((intersects[i].object.parent.name === 'icon' || (intersects[i].object.parent.name === 'bubble' && !previousBubble)) 
        && intersects[i].object.material.opacity >= 1)
        ){
        document.body.style.cursor = 'pointer';
        break;
      } else document.body.style.cursor = ''; 
    };

    if(hoverObject.parent.name === 'icon' && hoverObject.material.opacity >= 1){
      // Check if object the cursor is not assigned yet
      if(intersects[0].object.parent != currentHoverIcon.object){
        // if an icon has been hovered already and if it isn't the one the cursor is on
        if(currentHoverIcon.object && currentHoverIcon.object != hoverObject.parent){
          iconHover(currentHoverIcon, false);
        };
        // check if the current assigned icon is not being hovered
        if(!currentHoverIcon.isHovered){
          iconHover(currentHoverIcon, true, intersects[0].object.parent);
        };
      };
    } else {
      // if cursor is not on an icon but there is a icon that was previously hovered
      if(currentHoverIcon.object && currentHoverIcon.object != hoverObject.parent){
        iconHover(currentHoverIcon, false);
      };
    };
  } else {
    // if there was a previously hovered icon and it was currently hovered
    if(currentHoverIcon.object && currentHoverIcon.isHovered){
      iconHover(currentHoverIcon, false);
    };
    document.body.style.cursor = '';
  };
};

const iconHover = (currentHoverIcon, isHovered, object=undefined) => {
  currentHoverIcon.isHovered = isHovered;
  if(object) currentHoverIcon.object = object;
  iconHoverAnimation(currentHoverIcon.object, currentHoverIcon.isHovered);

  if(!object) currentHoverIcon.object = object;
};

const populateBubbles = async projects => {
  let row = 0;
  const xConst = 1.5;
  const yConst = -.55;
  const numOfBubbles = Object.keys(projects).length;

  for(let i = 0; i < numOfBubbles; i++){
    if(i === 0) {
      bubbles.push(await loadBubble(0, 0, projects[Object.keys(projects)[i]]));
      row++;
    } else if(i % 2 === 0) {
      bubbles.push(await loadBubble(row + xConst, row * (row * yConst), projects[Object.keys(projects)[i]]));
      row++;
    } else {
      bubbles.push(await loadBubble(-(row + xConst), row * (row * yConst), projects[Object.keys(projects)[i]]));
    };
  };
};

init(); // Initialize

update(); // Start update loop