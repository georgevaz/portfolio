import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import colors from './_colors.js'

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Loader
const loader = new GLTFLoader();

// Ollie Group
const ollieGroup = new THREE.Group();
const ollieLeftEar = new THREE.Group();
const ollieRightEar = new THREE.Group();
const olliePaws = new THREE.Group();
const ollieBody = new THREE.Group();
const table = new THREE.Group();

// This box gives an illusion of Ollie not appearing until animation begins
const geometry = new THREE.BoxGeometry( 2.9, 3, .4 );
const material = new THREE.MeshBasicMaterial( { color: grayLight } );
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

      olliePaws.add(
        ollie.getObjectByName("Left_Paw"),
        ollie.getObjectByName("Right_Paw"),
        ollie.getObjectByName("Left_Paw_Fill"),
        ollie.getObjectByName("Right_Paw_Fill")
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
        ollie.getObjectByName("Curve014"),
        ollie.getObjectByName("Curve015"),
        ollie.getObjectByName("Curve016"),
        ollie.getObjectByName("Head_Background"),
        ollie.getObjectByName("Body_Background"),
        ollie.getObjectByName("Beard"),
        ollie.getObjectByName("Beard_Fill001"),
        ollieLeftEar,
        ollieRightEar
      );
      
      table.add(ollie.getObjectByName("Table"));

      ollieGroup.add(
        olliePaws,
        ollieBody
      );

      table.scale.set(.5, .5, .5);
      ollieGroup.scale.set(.5, .5, .5);
      
      ollieGroup.position.x = 0;
      ollieGroup.position.y = -2.43; // original y pos
      ollieGroup.position.z = -0.5;

      table.position.x = 0;
      table.position.y = -2.5;
      table.position.z = -0.5;
      
      // Needs to be rotated because of how the file imported
      ollieGroup.rotation.x = THREE.MathUtils.degToRad(90);
      table.rotation.x = THREE.MathUtils.degToRad(90);
      
      // Set the parts lower to appear out of scene
      // It is z pos and instead of y pos because it's based on local positioning within the main group and not the global (scene) positioning
      ollieBody.position.z = 5.15;
      olliePaws.position.z = 5.15;

      // ollieBody clips a bit with olliePaws. Setting it back a little bit to mask that happening
      ollieBody.position.y = -.17;
      
      // Resetting the table material in order to add transparency and tween its opacity later
      table.children[0].material = new THREE.MeshStandardMaterial({ color: black });
      table.children[0].material.transparent = true;
      table.children[0].material.opacity = 0;
    },
    // on progress
    undefined,
    // on error
    (error) => {
      console.error(error);
    },
  );
};
  
loadOllie();

export default {
  ollieGroup,
  olliePaws,
  ollieBody,
  table,
  tableBottom
}