import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import colors from './_colors.js';
import text from './text.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Text
const { STRATOS, ROBOTO, h1, h2, createText } = text;

// Loader
const loader = new GLTFLoader();

const bubbles = [];
const BUBBLESCALE = [.3, .3, .3]

const loadBubble = (xPos, yPos, projectName, projectDescription) => {
  
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
      };

      // Function to set text
      const populateBubbleText = (bubbleText, textAttributes, callback, callbackParams) => {
        let zPos;
        let lineSpace;
        let currentLine;
        const { maxLength, singleLineZPos, multiLineZPos, tracking } = textAttributes;
        const { fontType, fontSize, fontThickness, xPos, yPos, textColor, name } = callbackParams;

        const setText = (text) => {
          text.position.z = zPos;
  
          if(lineSpace){
            zPos += lineSpace
  
            // Determine line spacing for tweening later
            text.lineSpace = lineSpace;
          };
          
          // Need to keep tabs on the original positioning for tweening
          text.originalPosition = {
            x: text.position.x,
            y: text.position.y,
            z: text.position.z,
          };

          // Making the text geometry a small font size often has the letters too close to each other
          // In the case of the description text, it does not look good
          // When loading the text by default, I set the font size to 1 and then to reduce the "font size", 
          // I can alter the scale instead
          // I don't like this block of code being here but it seems to work best since it is in a callback
          if(text.name === 'description'){
            text.scale.x = .15;
            text.scale.y = .15;
            text.scale.z = .15;
          };

          text.rotation.x = THREE.MathUtils.degToRad(270);
          bubbleGroup.add(text);
        };

        if(bubbleText.length <= maxLength) {
          zPos = singleLineZPos;
          callback(
            {
            fontType, 
            fontSize,
            fontThickness,
            xPos, 
            yPos, 
            textCopy: bubbleText, 
            textColor
            }, 
            setText, 
            name, 
          );
        } else {
          zPos = multiLineZPos;
          lineSpace = tracking;
          const bubbleTextSplit = bubbleText.split(' ');
          titleIsMulti = true;
          while(bubbleTextSplit.length){
            currentLine = bubbleTextSplit.shift();
            while(bubbleTextSplit.length && currentLine.length + bubbleTextSplit[0].length <= maxLength){
              currentLine += ' ' + bubbleTextSplit.shift();
            };
  
            callback(
              {
              fontType, 
              fontSize,
              fontThickness,
              xPos, 
              yPos, 
              textCopy: currentLine, 
              textColor
              }, 
              setText, 
              name, 
            );
            currentLine = '';
          };
        };
      };

      let titleIsMulti = false;

      // add title
      populateBubbleText(
        projectName, 
        {
          maxLength: 10,
          singleLineZPos: -3, 
          multiLineZPos: -3.35,
          tracking: .75
        }, 
        createText,
        {
          fontType: STRATOS, 
          fontSize: h1,
          fontThickness: 0,
          xPos: 0, 
          yPos: .5, 
          textColor: black,
          name: 'title'
        },
      );

      // add description
      populateBubbleText(
        projectDescription, 
        {
          maxLength: 20,
          singleLineZPos: titleIsMulti ? -2.8 : -3, 
          multiLineZPos: titleIsMulti ? -2.8 : -3,
          tracking: .2
        }, 
        createText,
        {
          fontType: ROBOTO, 
          fontSize: 1,
          fontThickness: 0,
          xPos: 0, 
          yPos: .5, 
          textColor: black,
          name: 'description',
        },
      );

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
    let projectName = projects[Object.keys(projects)[i]].name;
    let projectDescription = projects[Object.keys(projects)[i]].description;

    if(i === 0) {
      bubbles.push(loadBubble(0, 0, projectName, projectDescription))
      row++;
    } else if(i % 2 === 0) {
      bubbles.push(loadBubble(row + xConst, row * (row * yConst), projectName, projectDescription))
      row++;
    } else {
      bubbles.push(loadBubble(-(row + xConst), row * (row * yConst), projectName, projectDescription))
    };
  };
};

export default {
  bubbles,
  BUBBLESCALE,
  populateBubbles
};