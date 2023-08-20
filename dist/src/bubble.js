import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import colors from './_colors.js'

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Loader
const loader = new GLTFLoader();

const bubbles = [];

const loadBubble = (xPos=0, yPos=0) => {
  
  // Bubble Group
  const bubbleGroup = new THREE.Group();
  const bigBubbleGroup = new THREE.Group();
  const smallBubble1Group = new THREE.Group();
  const smallBubble2Group = new THREE.Group();
  
  loader.load('./assets/bubble.glb', // url
    // on load
    (gltf) => {
      const bubble = gltf.scene;

      // Resetting the material in order to add transparency and tween its opacity later
      // Each child is getting a brand new insantiated material because if they share the same instance of it, 
      // when it gets tweened later, it tweens all objects with that instance.
      bubble.children.forEach(child => {
        if(child.name.slice(-4) === 'Fill') child.material = new THREE.MeshStandardMaterial({ color: grayLight });
        else child.material = new THREE.MeshStandardMaterial({ color: black });
        child.material.transparent = true
        child.material.opacity = 0
      });


      // group setup
      bigBubbleGroup.add(
        bubble.getObjectByName("Big_Bubble"), 
        bubble.getObjectByName("Big_Bubble_Fill")
      );

      smallBubble1Group.add(
        bubble.getObjectByName("Small_Bubble_1"), 
        bubble.getObjectByName("Small_Bubble_1_Fill")
      );

      smallBubble2Group.add(
        bubble.getObjectByName("Small_Bubble_2"), 
        bubble.getObjectByName("Small_Bubble_2_Fill")
      );
      
      bubbleGroup.add(
        bigBubbleGroup,
        smallBubble1Group,
        smallBubble2Group
      );

      bubbleGroup.scale.set(.5, .5, .5);
      
      // Needs to be offset a bit from center
      bubbleGroup.position.x = xPos -.32;
      bubbleGroup.position.y = yPos + 0.5;
      bubbleGroup.position.z = -0.6;

      // The z axis is used instead of the y here due to the original Blender model's orientation
      // Offsets the smaller bubbles to be diagonal to big bubble
      smallBubble1Group.position.x = -xPos / 1;
      smallBubble1Group.position.z = yPos / 3;

      smallBubble2Group.position.x = -xPos / 1.5;
      smallBubble2Group.position.z = yPos / 3.5;
      
      // Needs to be rotated because of how the file imported
      bubbleGroup.rotation.x = THREE.MathUtils.degToRad(90);

    },
    // on progress
    undefined,
    // on error
    (error) => {
      console.error(error);
    },
  );
  return bubbleGroup;
};

const populateBubbles = (numOfBubbles) => {
  let row = 0;
  const xConst = 1.5;
  const yConst = -.5;

  for(let i = 0; i < numOfBubbles; i++){
    if(i === 0) {
      bubbles.push(loadBubble())
      row++;
    } else if(i % 2 === 0) {
      bubbles.push(loadBubble(row + xConst, row * (row * yConst)))
      row++;
    } else {
      bubbles.push(loadBubble(-(row + xConst), row * (row * yConst)))
    };
  };
};

export default {
  bubbles,
  populateBubbles
}