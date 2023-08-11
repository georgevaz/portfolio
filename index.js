import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { MathUtils } from 'three';
import TWEEN from '@tweenjs/tween.js'

let camera, scene, renderer, light, controls;
let raycaster, pointer;
let loader, fontLoader;

// Colors
const black = 0x000000;
const white = 0xffffff;
const grayDark = 0x666867;
const gray = 0xB3B3B3;
const grayLight = 0xDFDFDF;

// Font Paths
const stratos = './fonts/Stratos_Regular.json';

// Font Sizes
const h1 = 0.4;
const h2 = 0.2;

// Text Group
const textGroup = new THREE.Group();

// Ollie Group
const ollieGroup = new THREE.Group();
const ollieLeftEar = new THREE.Group();
const ollieRightEar = new THREE.Group();
const ollieBody = new THREE.Group();
const table = new THREE.Group();

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

    // Set Loaders
    loader = new GLTFLoader();
    fontLoader = new FontLoader();

    loadFont();
    loadOllie();

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

const loadFont = () => {
  createText(stratos, h1, -3.5, 3.5, "Hi, I'm George");
  createText(stratos, h2, -3.68, 3, "I’m a software engineer");
  createText(stratos, h1, 3.23, -3, "and this is Ollie!");
  createText(stratos, h2, 1.95, -3.5, "he’s a dog");

  scene.add(textGroup)
};

const createText = (fontType, fontSize, xPos, yPos, textCopy) => {
  fontLoader.load(fontType, // url
    //on load
    (font) => {
      const geometry = new TextGeometry(textCopy, {
        font,
        size: fontSize,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .01,
        bevelSize: .01,
        bevelOffset: 0,
        bevelSegments: 5
      });
      const material = new THREE.MeshPhongMaterial({ color: grayDark });
      const text = new THREE.Mesh(geometry, material);
      text.name = textCopy;

      // center the text, and then move it
      geometry.center();
      text.position.x = xPos;
      text.position.y = yPos;

      text.material.transparent = true;
      text.material.opacity = 0.0;

      textGroup.add(text);
    },
    // on progress
    undefined,
    // on error,
    (error) => {
      console.log(error)
    },
  );
};

const loadOllie = () => {
  loader.load('./src/ollie.glb', // url
    // on load
    (gltf) => {
      const ollie = gltf.scene;
      // group setup
      ollieLeftEar.add(ollie.getObjectByName("Left_Ear"));
      ollieLeftEar.add(ollie.getObjectByName("Left_Ear_Fill"));

      ollieRightEar.add(ollie.getObjectByName("Right_Ear001"));
      ollieRightEar.add(ollie.getObjectByName("Right_Ear_Fill"));

      ollieBody.add(ollie.getObjectByName("Nose"));
      ollieBody.add(ollie.getObjectByName("Moustache"));
      ollieBody.add(ollie.getObjectByName("Left_Eye"));
      ollieBody.add(ollie.getObjectByName("Left_Eyebrow"));
      ollieBody.add(ollie.getObjectByName("Left_Eyebrow_Fill"));
      ollieBody.add(ollie.getObjectByName("Right_Eye"));
      ollieBody.add(ollie.getObjectByName("Right_Eyebrow"));
      ollieBody.add(ollie.getObjectByName("Right_Eyebrow_Fill"));
      ollieBody.add(ollie.getObjectByName("Left_Paw"));
      ollieBody.add(ollie.getObjectByName("Right_Paw"));
      ollieBody.add(ollie.getObjectByName("Curve014"));
      ollieBody.add(ollie.getObjectByName("Curve015"));
      ollieBody.add(ollie.getObjectByName("Curve016"));
      ollieBody.add(ollie.getObjectByName("Left_Paw_Fill"));
      ollieBody.add(ollie.getObjectByName("Right_Paw_Fill"));
      ollieBody.add(ollie.getObjectByName("Head_Background"));
      ollieBody.add(ollie.getObjectByName("Body_Background"));
      ollieBody.add(ollie.getObjectByName("Beard"));
      ollieBody.add(ollie.getObjectByName("Beard_Fill001"));
      
      table.add(ollie.getObjectByName("Table"));

      const geometry = new THREE.BoxGeometry( 2.8, 3, .3 );
      const material = new THREE.MeshBasicMaterial( { color: grayLight } );
      const tableBottom = new THREE.Mesh( geometry, material );
      tableBottom.position.x = -.35;
      tableBottom.position.y = -3.97;
      tableBottom.position.z = -.3;
      scene.add(tableBottom);

      ollieGroup.add(ollieLeftEar);
      ollieGroup.add(ollieRightEar);
      ollieGroup.add(ollieBody);

      table.scale.set(.5, .5, .5);
      ollieGroup.scale.set(.5, .5, .5);

      ollieGroup.position.x = 0;
      ollieGroup.position.y = -4.9;
      ollieGroup.position.z = -0.5;

      table.position.x = 0;
      table.position.y = -2.5;
      table.position.z = -0.5;
      
      ollieGroup.rotation.x = THREE.MathUtils.degToRad(90);
      table.rotation.x = THREE.MathUtils.degToRad(90);

      scene.add(table)
      scene.add(ollieGroup)

      new TWEEN.Tween(ollieGroup.position)
      .to(
        {
          y: -2.43
        }, 1000
      )
      .easing(TWEEN.Easing.Cubic.Out)
      .start()
      .onComplete(() => {
        new TWEEN.Tween(ollieGroup.position)
        .to(
          {
          y: -2.5
          }, 500
        )
        .easing(TWEEN.Easing.Bounce.Out)
        .start()
      });
    },
    // on progress
    undefined,
    // on error
    (error) => {
      console.error(error);
    },
  );
};

const textAnimation = () => {
  let easeChild = (child) =>
    new TWEEN.Tween(child.material)
      .to(
        {
          opacity: 1
        }, 1000
      )
      .easing(TWEEN.Easing.Linear.None)
      .delay(1000)
      .start()

  const recurse = (children) => {
    if(children.length === 1) return easeChild(children[0]);
    if(children.length < 1) return undefined;
    easeChild(children[0])
    .onComplete(() => recurse(children.slice(1)));
  };

  recurse(textGroup.children)

  // easeChild(textGroup.children[0])
  //   .onComplete(
  //     () => easeChild(textGroup.children[1])
  //       .onComplete(
  //         () => easeChild(textGroup.children[2])
  //           .onComplete(() => easeChild(textGroup.children[3]))
  //       )
  //   )
};

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

init(); // Initialize
render(); // Render first frame

// Needs to wait for fonts to load, 1 second seems to suffice
setTimeout(() => {
  textAnimation();
}, 1000);

update(); // Start update loop