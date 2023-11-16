import * as THREE from 'three';
import { loadGLTF } from './_GLTFLoader.js';

import { black, grayDark, gray, red, cream } from './_colors.js';
import { githubIcon, browserIcon, searchIcon, videoIcon, leftIcon, rightIcon, exitIcon } from './_icons.js';
import { STRATOS, ROBOTO, h1, h2, createText } from './createText.js';
import { createIcon } from './createIcon.js';

// Object Colors
const outlineColor = black;
const fillColor = cream;

// Font Color
const fontColor = black;

// Icon Color
const iconColor = black;

// Load bubble
const gltf = await loadGLTF('./assets/bubble.glb');

const bubbles = [];
const BUBBLESCALE = [.3, .3, .3];

// This is mainly for ease of use during development
const startingOpacity = 0;

const setBubbleIcon = (icon, scale, position) => {
  // SVG default size is huge
  icon.scale.set(scale, scale, scale);
  
  // Needs to be rotated because of how the file imported within the bubble
  icon.rotation.x = THREE.MathUtils.degToRad(90);

  // Needs to be positioned
  icon.position.set(position.x, position.y, position.z);

  icon.children.forEach(mesh => mesh.material.opacity = startingOpacity);
};

const loadBubble = (xPos, yPos, project) => {
  let titleIsMulti = false;

  // Parent Group
  const bubbleGroup = new THREE.Group();

  const descriptionGroup = new THREE.Group();

  bubbleGroup.name = 'bubble';
  
  bubbleGroup.images = project.images;
  bubbleGroup.imageClass = project.imageClass;

  descriptionGroup.name = 'description';

  // Function to set text
  const populateBubbleText = (bubbleText, group, textAttributes, callback, callbackParams) => {
    let textZPos;
    let lineSpace;
    let currentLine;
    const { maxLength, singleLineZPos, multiLineZPos, tracking } = textAttributes;
    const { name } = callbackParams;

    const setText = text => {
      text.position.z = textZPos;

      if(lineSpace){
        textZPos += lineSpace;

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
      if(text.name === 'descriptionText'){
        text.scale.x = .15;
        text.scale.y = .15;
        text.scale.z = .15;
      };

      text.rotation.x = THREE.MathUtils.degToRad(270);

      group.add(text);
    };

    if(bubbleText.length <= maxLength) {
      textZPos = singleLineZPos;
      callback(
        { ...callbackParams,
        textCopy: bubbleText }, 
        setText, 
        name,
        startingOpacity
      );
    } else {
      textZPos = multiLineZPos;
      lineSpace = tracking;
      const bubbleTextSplit = bubbleText.split(' ');
      titleIsMulti = true;
      while(bubbleTextSplit.length){
        currentLine = bubbleTextSplit.shift();
        while(bubbleTextSplit.length && currentLine.length + bubbleTextSplit[0].length <= maxLength){
          currentLine += ' ' + bubbleTextSplit.shift();
        };
        callback(
          { ...callbackParams,
          textCopy: currentLine }, 
          setText, 
          name,
          startingOpacity
        );
        currentLine = '';
      };
    };
  };

  const bubble = gltf.scene.clone(); // need to clone the bubble here to make separate instances of it
  
  // Resetting the material in order to add transparency and tween its opacity later
  // Each child is getting a brand new insantiated material because if they share the same instance of it, 
  // when it gets tweened later, it tweens all objects with that instance.
  bubble.children.forEach(child => {
    if(child.name.slice(-4) === 'Fill') child.material = new THREE.MeshStandardMaterial({ color: fillColor });
    else child.material = new THREE.MeshStandardMaterial({ color: outlineColor });
    child.material.transparent = true;
    child.material.opacity = startingOpacity;
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

  // add title
  populateBubbleText(
    project.name,
    bubbleGroup,
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
      textColor: fontColor,
      name: 'titleText',
      startingOpacity
    },
  );

  // add description
  populateBubbleText(
    project.description,
    descriptionGroup,
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
      textColor: fontColor,
      name: 'descriptionText',
      startingOpacity
    },
  );

  // add icons
  const projectLinksKeys = Object.keys(project.links);
  let iconPos = new THREE.Vector3(projectLinksKeys.length * -.38, .55, -2.2);
  
  // every bubble will have the search icon, so that will go first
  createIcon(
    searchIcon, 
    'portfolioMocks', 
    iconColor,
    icon => {
      setBubbleIcon(icon, .007, iconPos);

      descriptionGroup.add(icon);
      iconPos.x += .75;

      for(let i = 0; i < projectLinksKeys.length; i++){
        createIcon(
          project.links[projectLinksKeys[i]].icon, 
          projectLinksKeys[i], 
          iconColor,
          icon => {
            setBubbleIcon(icon, .007, iconPos);
            
            descriptionGroup.add(icon);
            iconPos.x += .75;
          }, 
          project.links[projectLinksKeys[i]].url
        );
      };
    }, 
    ''
  );

  // Needs to be rotated because of how the file imported
  bubbleGroup.rotation.x = THREE.MathUtils.degToRad(90);

  bubbleGroup.add(descriptionGroup);
  return bubbleGroup;
};

const populateBubbles = projects => {
  let row = 0;
  const xConst = 1.5;
  const yConst = -.55;
  const numOfBubbles = Object.keys(projects).length;

  for(let i = 0; i < numOfBubbles; i++){
    if(i === 0) {
      bubbles.push(loadBubble(0, 0, projects[Object.keys(projects)[i]]));
      row++;
    } else if(i % 2 === 0) {
      bubbles.push(loadBubble(row + xConst, row * (row * yConst), projects[Object.keys(projects)[i]]));
      row++;
    } else {
      bubbles.push(loadBubble(-(row + xConst), row * (row * yConst), projects[Object.keys(projects)[i]]));
    };
  };
};

export { bubbles, BUBBLESCALE, populateBubbles };