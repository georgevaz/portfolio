import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import colors from './_colors.js';

// Colors
const { black, white, grayDark, gray, grayLight, red, cream } = colors;

// Object Colors
const tableColor = black;
const tableBoxColor = cream; // this has to match the background color of the scene
const darkFillColor = gray;
const lightFillColor = cream;
const outlineColor = black;

// Loader
const loader = new GLTFLoader();

// Ollie Group
const ollieGroup = new THREE.Group();
const ollieLeftEar = new THREE.Group();
const ollieRightEar = new THREE.Group();
const ollieLeftEye = new THREE.Group();
const ollieRightEye = new THREE.Group();
const olliePaws = new THREE.Group();
const ollieBody = new THREE.Group();
const table = new THREE.Group();

ollieGroup.name = 'ollieGroup';
ollieLeftEar.name = 'ollieLeftEar';
ollieRightEar.name = 'ollieRightEar';
ollieLeftEye.name = 'ollieLeftEye';
ollieRightEye.name = 'ollieRightEye';
olliePaws.name = 'olliePaw';
ollieBody.name = 'ollieBody';
table.name = 'table';

// This box gives an illusion of Ollie not appearing until animation begins
const geometry = new THREE.BoxGeometry( 2.9, 3, .4 );
const material = new THREE.MeshBasicMaterial({ color: tableBoxColor });
const tableBottom = new THREE.Mesh(geometry, material);
tableBottom.name = 'tableBottom';
tableBottom.position.x = -.35;
tableBottom.position.y = -3.97;
tableBottom.position.z = -.3;

// Eyes center points, roughly based on world position
const leftEyeCenter = new THREE.Vector2(-0.1327014218009479, -0.10897435897435903);
const rightEyeCenter = new THREE.Vector2(0.014218009478673022, -0.10897435897435903);

const eyePosThreshold = {
  x: 0.1,
  y: 0.05,
}

const loadOllie = () => {
  loader.load('./assets/ollie.glb', // url
    // on load
    gltf => {
      const ollie = gltf.scene;
      // pull materials out from imported model's objects to be able to change colors when needed
      // need to clone materials so we can assign appropriately
      let darkFillMaterial = ollie.getObjectByName("Left_Ear_Fill").material.clone();
      let lightFillMaterial = ollie.getObjectByName("Left_Ear_Fill").material.clone();
      let outlineMaterial = new THREE.MeshPhongMaterial({ color: outlineColor });
      
      darkFillMaterial.color.setHex(darkFillColor);
      lightFillMaterial.color.setHex(lightFillColor);

      // assign the new materials
      ollie.children.forEach(mesh => {
        mesh.name.indexOf('Fill') > -1 || mesh.name.indexOf('Background') > -1? 
          mesh.name.indexOf('Beard') > -1 || mesh.name.indexOf('Eyebrow') > -1 || mesh.name.indexOf('Paw') > -1 ?
            mesh.material = lightFillMaterial
            :
            mesh.material = darkFillMaterial
          :
          mesh.material = outlineMaterial;
      });

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

      ollieLeftEye.add(
        ollie.getObjectByName("Left_Eye")
      );

      ollieRightEye.add(
        ollie.getObjectByName("Right_Eye")
      );

      ollieBody.add(
        ollie.getObjectByName("Nose"),
        ollie.getObjectByName("Moustache"),
        ollie.getObjectByName("Left_Eyebrow"),
        ollie.getObjectByName("Left_Eyebrow_Fill"),
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
        ollieRightEar,
        ollieLeftEye,
        ollieRightEye
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
      table.children[0].material = new THREE.MeshStandardMaterial({ color: tableColor });
      table.children[0].material.transparent = true;
      table.children[0].material.opacity = 0;
    },
    // on progress
    undefined,
    // on error
    error => {
      console.error(error);
    },
  );
};

const moveEyes = pointer => {
  changeEyePosition(pointer, leftEyeCenter, ollieLeftEye);
  changeEyePosition(pointer, rightEyeCenter, ollieRightEye);
};

const changeEyePosition = (pointer, eyeCenterPos, ollieEye) => {
  let xPos = pointer.x - eyeCenterPos.x;
  let yPos = eyeCenterPos.y - pointer.y;
  if(xPos < eyePosThreshold.x && xPos > -eyePosThreshold.x) ollieEye.position.x = xPos;
  else ollieEye.position.x = xPos < 0 ? -eyePosThreshold.x : eyePosThreshold.x;
  if(yPos < eyePosThreshold.y && yPos > -eyePosThreshold.y) ollieEye.position.z = yPos;
  else ollieEye.position.z = yPos < 0 ? -eyePosThreshold.y : eyePosThreshold.y;
};

loadOllie();

export default {
  ollieGroup,
  olliePaws,
  ollieLeftEye,
  ollieRightEye,
  ollieBody,
  table,
  tableBottom,
  moveEyes
}