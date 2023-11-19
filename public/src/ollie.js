import * as THREE from 'three';
import { loadGLTF } from './_GLTFLoader.js';

import { black, grayDark, gray, red, cream } from './_colors.js';

export class Ollie {
  constructor() {
    // Object Colors
    this.tableColor = black;
    this.tableBoxColor = cream; // this has to match the background color of the scene
    this.darkFillColor = gray;
    this.lightFillColor = cream;
    this.outlineColor = black;
    
    // Ollie Group
    this.ollieGroup = new THREE.Group();
    this.ollieLeftEar = new THREE.Group();
    this.ollieRightEar = new THREE.Group();
    this.ollieLeftEye = new THREE.Group();
    this.ollieRightEye = new THREE.Group();
    this.olliePaws = new THREE.Group();
    this.ollieBody = new THREE.Group();
    this.table = new THREE.Group();
    
    this.ollieGroup.name = 'ollieGroup';
    this.ollieLeftEar.name = 'ollieLeftEar';
    this.ollieRightEar.name = 'ollieRightEar';
    this.ollieLeftEye.name = 'ollieLeftEye';
    this.ollieRightEye.name = 'ollieRightEye';
    this.olliePaws.name = 'olliePaw';
    this.ollieBody.name = 'ollieBody';
    this.table.name = 'table';
    
    // This box gives an illusion of Ollie not appearing until animation begins
    this.tableBottomGeometry = new THREE.BoxGeometry( 2.9, 3, .4 );
    this.tableBottomMaterial = new THREE.MeshBasicMaterial({ color: this.tableBoxColor });
    this.tableBottom = new THREE.Mesh(this.tableBottomGeometry, this.tableBottomMaterial);
    this.tableBottom.name = 'tableBottom';
    this.tableBottom.position.x = -.35;
    this.tableBottom.position.y = -3.97;
    this.tableBottom.position.z = -.3;

    // Eyes center points, roughly based on world position
    this.eyeCenterPoint = new THREE.Vector2(-0.05924170616113744, -0.10897435897435903);
    this.eyePosThreshold = {
      x: 0.1,
      y: 0.05,
    };
  };
  
  async loadOllie() {
    // Load Ollie
    const gltf = await loadGLTF('./assets/ollie.glb');
  
    const ollie = gltf.scene;
    // pull materials out from imported model's objects to be able to change colors when needed
    // need to clone materials so we can assign appropriately
    let darkFillMaterial = ollie.getObjectByName("Left_Ear_Fill").material.clone();
    let lightFillMaterial = ollie.getObjectByName("Left_Ear_Fill").material.clone();
    let outlineMaterial = new THREE.MeshPhongMaterial({ color: this.outlineColor });
    
    darkFillMaterial.color.setHex(this.darkFillColor);
    lightFillMaterial.color.setHex(this.lightFillColor);
  
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
    this.ollieLeftEar.add(
      ollie.getObjectByName("Left_Ear"), 
      ollie.getObjectByName("Left_Ear_Fill")
    );
  
    this.ollieRightEar.add(
      ollie.getObjectByName("Right_Ear001"),
      ollie.getObjectByName("Right_Ear_Fill")
    );
  
    this.olliePaws.add(
      ollie.getObjectByName("Left_Paw"),
      ollie.getObjectByName("Right_Paw"),
      ollie.getObjectByName("Left_Paw_Fill"),
      ollie.getObjectByName("Right_Paw_Fill")
    );
  
    this.ollieLeftEye.add(
      ollie.getObjectByName("Left_Eye")
    );
  
    this.ollieRightEye.add(
      ollie.getObjectByName("Right_Eye")
    );
  
    this.ollieBody.add(
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
      this.ollieLeftEar,
      this.ollieRightEar,
      this.ollieLeftEye,
      this.ollieRightEye
    );
    
    this.table.add(ollie.getObjectByName("Table"));
  
    this.ollieGroup.add(
      this.olliePaws,
      this.ollieBody
    );
  
    this.table.scale.set(.5, .5, .5);
    this.ollieGroup.scale.set(.5, .5, .5);
    
    this.ollieGroup.position.x = 0;
    this.ollieGroup.position.y = -2.43; // original y pos
    this.ollieGroup.position.z = -0.5;
  
    this.table.position.x = 0;
    this.table.position.y = -2.5;
    this.table.position.z = -0.5;
    
    // Needs to be rotated because of how the file imported
    this.ollieGroup.rotation.x = THREE.MathUtils.degToRad(90);
    this.table.rotation.x = THREE.MathUtils.degToRad(90);
    
    // Set the parts lower to appear out of scene
    // It is z pos and instead of y pos because it's based on local positioning within the main group and not the global (scene) positioning
    this.ollieBody.position.z = 5.15;
    this.olliePaws.position.z = 5.15;
  
    // ollieBody clips a bit with olliePaws. Setting it back a little bit to mask that happening
    this.ollieBody.position.y = -.17;
    
    // Resetting the table material in order to add transparency and tween its opacity later
    this.table.children[0].material = new THREE.MeshStandardMaterial({ color: this.tableColor });
    this.table.children[0].material.transparent = true;
    this.table.children[0].material.opacity = 0;
  };

  changeEyePosition(pointer, ollieEye) {
    let xPos = pointer.x - this.eyeCenterPoint.x;
    let yPos = this.eyeCenterPoint.y - pointer.y;
    if(xPos < this.eyePosThreshold.x && xPos > -this.eyePosThreshold.x) ollieEye.position.x = xPos;
    else ollieEye.position.x = xPos < 0 ? -this.eyePosThreshold.x : this.eyePosThreshold.x;
    if(yPos < this.eyePosThreshold.y && yPos > -this.eyePosThreshold.y) ollieEye.position.z = yPos;
    else ollieEye.position.z = yPos < 0 ? -this.eyePosThreshold.y : this.eyePosThreshold.y;
  };

  moveEyes(pointer) {
    this.changeEyePosition(pointer, this.ollieLeftEye);
    this.changeEyePosition(pointer, this.ollieRightEye);
  };
};