import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import colors from './_colors.js';
import text from './text.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Text
const { STRATOS, h1, h2, createText } = text;

// Loader
const loader = new GLTFLoader();

const bubbles = [];
const BUBBLESCALE = [.3, .3, .3]

const loadBubble = (xPos, yPos, projectName) => {
  
  // Bubble Group
  const bubbleGroup = new THREE.Group();
  
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
        child.material.transparent = true;
        child.material.opacity = 0;
      });

      // group setup   
      bubbleGroup.add(
        bubble.getObjectByName("Big_Bubble"), 
        bubble.getObjectByName("Big_Bubble_Fill")
      );

      bubbleGroup.scale.set(...BUBBLESCALE);
      
      // Needs to be offset a bit from center
      bubbleGroup.position.x = xPos -.32;
      bubbleGroup.position.y = yPos + 0.5;
      bubbleGroup.position.z = -0.6;

      // Need to keep tabs on the original positioning for tweening
      bubbleGroup.originalPosition = {
        x: bubbleGroup.position.x,
        y: bubbleGroup.position.y,
        z: bubbleGroup.position.z,
      }

      // add title
      // ten letters max per line, logic to check if it needs multiple lines
      if(projectName.length <= 10) {
        createText(STRATOS, h1, 0, .5, projectName.slice(0, 10), black, (text) => {
          text.position.z = -3;
          text.rotation.x = THREE.MathUtils.degToRad(270);
          bubbleGroup.add(text)
        });
      } else {
        let zPos = -3.35;
        let currentLine;
        const projectNameSplit = projectName.split(' ');
        while(projectNameSplit.length){
          currentLine = projectNameSplit.shift();
          while(projectNameSplit.length && currentLine.length + projectNameSplit[0].length <= 10){
            currentLine += ' ' + projectNameSplit.shift();
          };
          createText(STRATOS, h1, 0, .5, currentLine, black, (text) => {
            text.position.z = zPos;
            zPos += .75;
            text.rotation.x = THREE.MathUtils.degToRad(270);
            bubbleGroup.add(text);
          });
          currentLine = '';
        };
      };

      bubbleGroup.name = 'bubble';
      
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

const populateBubbles = (numOfBubbles, projects) => {
  let row = 0;
  const xConst = 1.5;
  const yConst = -.55;

  for(let i = 0; i < numOfBubbles; i++){
    if(i === 0) {
      bubbles.push(loadBubble(0, 0, projects[Object.keys(projects)[i]].name))
      row++;
    } else if(i % 2 === 0) {
      bubbles.push(loadBubble(row + xConst, row * (row * yConst), projects[Object.keys(projects)[i]].name))
      row++;
    } else {
      bubbles.push(loadBubble(-(row + xConst), row * (row * yConst), projects[Object.keys(projects)[i]].name))
    };
  };
};

export default {
  bubbles,
  BUBBLESCALE,
  populateBubbles
}