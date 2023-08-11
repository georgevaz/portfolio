import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js'

import colors from './_colors.js'

// Colors
const { white, grayDark, gray, grayLight } = colors

// Loader
const loader = new GLTFLoader();

// Ollie Group
const ollieGroup = new THREE.Group();
const ollieLeftEar = new THREE.Group();
const ollieRightEar = new THREE.Group();
const ollieBody = new THREE.Group();
const table = new THREE.Group();

// This box gives an illusion of Ollie not appearing until animation begins
const geometry = new THREE.BoxGeometry( 2.8, 3, .3 );
const material = new THREE.MeshBasicMaterial( { color: colors.grayLight } );
const tableBottom = new THREE.Mesh( geometry, material );
tableBottom.position.x = -.35;
tableBottom.position.y = -3.97;
tableBottom.position.z = -.3;

const loadOllie = () => {
  loader.load('./assets/ollie.glb', // url
    // on load
    (gltf) => {
      const ollie = gltf.scene;

      // group setup
      ollieLeftEar.add(
        ollie.getObjectByName("Left_Ear"), 
        ollie.getObjectByName("Left_Ear_Fill")
      );

      ollieRightEar.add(
        ollie.getObjectByName("Right_Ear001"),
        ollie.getObjectByName("Right_Ear_Fill")
      );

      ollieBody.add(
        ollie.getObjectByName("Nose"),
        ollie.getObjectByName("Moustache"),
        ollie.getObjectByName("Left_Eye"),
        ollie.getObjectByName("Left_Eyebrow"),
        ollie.getObjectByName("Left_Eyebrow_Fill"),
        ollie.getObjectByName("Right_Eye"),
        ollie.getObjectByName("Right_Eyebrow"),
        ollie.getObjectByName("Right_Eyebrow_Fill"),
        ollie.getObjectByName("Left_Paw"),
        ollie.getObjectByName("Right_Paw"),
        ollie.getObjectByName("Curve014"),
        ollie.getObjectByName("Curve015"),
        ollie.getObjectByName("Curve016"),
        ollie.getObjectByName("Left_Paw_Fill"),
        ollie.getObjectByName("Right_Paw_Fill"),
        ollie.getObjectByName("Head_Background"),
        ollie.getObjectByName("Body_Background"),
        ollie.getObjectByName("Beard"),
        ollie.getObjectByName("Beard_Fill001")
      );
      
      table.add(ollie.getObjectByName("Table"));

      ollieGroup.add(
        ollieLeftEar,
        ollieRightEar,
        ollieBody
      );

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

    },
    // on progress
    undefined,
    // on error
    (error) => {
      console.error(error);
    },
  );
};

const ollieAnimation = () => {
  new TWEEN.Tween(ollieGroup.position)
  .to(
    {
      y: -2.43
    }, 1000
  )
  .delay(2000)
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
};

loadOllie();

export default {
  ollieGroup,
  table,
  tableBottom,
  ollieAnimation
}