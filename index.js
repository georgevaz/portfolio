import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

let camera, scene, renderer, light, controls;
let raycaster, pointer;
let loader, fontLoader;

const init = () => {
  if (WebGL.isWebGLAvailable()) {
    // Set Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('pink');
    
    // Set Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    
    // Set Lighting
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    
    // Set Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);
  
    // Set Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
  
    // Set Raycasting
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();
  
    // Set Loaders
    loader = new GLTFLoader();
    fontLoader = new FontLoader();

    loadFont();

    // Shoot a raycast
    // window.addEventListener('click', onClick);
    // window.addEventListener('touchstart', onClick);
  
    // Handles resizing of window
    window.addEventListener('resize', onWindowResize);

  } else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
  
  };
};

// Update frames
const update = () => {
  controls.update()

  // Update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  if(intersects.length > 0) {
    for (let i = 0; i < intersects.length; i ++) {
      // if(intersects[i].object.name === 'donutText') {
      //   loadDonut();
      // };
    };

    // Reset pointer
    pointer.x = null;
    pointer.y = null;
  }

  requestAnimationFrame(update);
  renderer.render(scene, camera);
};

const onWindowResize = (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const loadFont = () => {
  fontLoader.load('./fonts/Stratos_Regular.json', function (font) {
    const geometry = new TextGeometry( "Hi, I'm George", {
      font,
      size: 1,
      height: 0.25,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: .01,
      bevelSize: .01,
      bevelOffset: 0,
      bevelSegments: 5
    });
    geometry.center();
    const material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const text = new THREE.Mesh(geometry, material);
    text.name = 'donutText';
    scene.add(text);
  });
};

init();
update();