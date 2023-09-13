import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import colors from './_colors.js';
import icons from './_icons.js';
import textLoader from './textLoader.js';
import iconLoader from './iconLoader.js';
import imageLoader from './imageLoader.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors;

// Icons
const { githubIcon, browserIcon, searchIcon, videoIcon, leftIcon, rightIcon, exitIcon } = icons;

// Text Loader
const { STRATOS, ROBOTO, h1, h2, createText } = textLoader;

// Icon Loader
const { createIcon } = iconLoader

// Images
const { createImage } = imageLoader;

// Loader
const loader = new GLTFLoader();

const bubbles = [];
const BUBBLESCALE = [.3, .3, .3];

// This is mainly for ease of use during development
const startingOpacity = 0;

let titleIsMulti = false;

// Function to set text
const populateBubbleText = (bubbleText, group, textAttributes, callback, callbackParams) => {
  let textZPos;
  let lineSpace;
  let currentLine;
  const { maxLength, singleLineZPos, multiLineZPos, tracking } = textAttributes;
  const { fontType, fontSize, fontThickness, xPos, yPos, textColor, name } = callbackParams;

  const setText = (text) => {
    text.position.z = textZPos;

    if(lineSpace){
      textZPos += lineSpace

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
        startingOpacity
      );
      currentLine = '';
    };
  };
};

const setIcon = (icon, scale, position) => {
  // SVG default size is huge
  icon.scale.set(scale, scale, scale)
  
  // Needs to be rotated because of how the file imported
  icon.rotation.x = THREE.MathUtils.degToRad(90);

  // Needs to be positioned
  icon.position.set(position.x, position.y, position.z);

  icon.children.forEach(mesh => mesh.material.opacity = startingOpacity)
};

const loadBubble = (xPos, yPos, projectName, projectDescription, projectLinks) => {
  
  // Parent Group
  const bubbleGroup = new THREE.Group();

  const descriptionGroup = new THREE.Group();
  const mockGroup = new THREE.Group();

  bubbleGroup.name = 'bubble';
  descriptionGroup.name = 'description';
  mockGroup.name = 'mock';

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
        projectName,
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
          textColor: black,
          name: 'titleText',
          startingOpacity
        },
      );

      // add description
      populateBubbleText(
        projectDescription,
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
          textColor: black,
          name: 'descriptionText',
          startingOpacity
        },
      );

      // add icons
      const projectLinksKeys = Object.keys(projectLinks);
      let iconPos = new THREE.Vector3(projectLinksKeys.length * -.38, .55, -2.2);
      
      // every bubble will have the search icon, so that will go first
      createIcon(
        searchIcon, 
        'portfolioMocks', 
        (icon) => {
          setIcon(icon, .007, iconPos);

          descriptionGroup.add(icon);
          iconPos.x += .75;

          for(let i = 0; i < projectLinksKeys.length; i++){
            createIcon(
              projectLinks[projectLinksKeys[i]].icon, 
              projectLinksKeys[i], 
              (icon) => {
                setIcon(icon, .007, iconPos);
                
                descriptionGroup.add(icon);
                iconPos.x += .75;
              }, 
              projectLinks[projectLinksKeys[i]].url
            );
          };
        }, 
        ''
      );

      // the mock up section of the bubble
      createImage('./assets/Zukeeper-1.gif', 2.4, (mesh) => {
        // Needs to be rotated because of how the file imported
        mesh.rotation.x = THREE.MathUtils.degToRad(270);

        mesh.material.opacity = startingOpacity;
        mesh.position.set(0, .4, -3);

        mesh.name = 'portfolioMock';

        mockGroup.add(mesh);
      });

      createIcon(exitIcon, 'exit', (icon) => {
        setIcon(icon, .002, new THREE.Vector3(0, .56, -2.2));
        mockGroup.add(icon);
      }, '');

      let arrowPos = new THREE.Vector3(-1.4, .67, -3);
      createIcon(leftIcon, 'left', (icon) => {
        setIcon(icon, .007, arrowPos);
        mockGroup.add(icon);
      }, '');

      createIcon(rightIcon, 'right', (icon) => {
        arrowPos.x = -arrowPos.x;
        setIcon(icon, .007, arrowPos);
        mockGroup.add(icon);
      }, '');

      // Needs to be rotated because of how the file imported
      bubbleGroup.rotation.x = THREE.MathUtils.degToRad(90);

      bubbleGroup.add(descriptionGroup, mockGroup);
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

const populateBubbles = projects => {
  let row = 0;
  const xConst = 1.5;
  const yConst = -.55;
  const numOfBubbles = Object.keys(projects).length;

  for(let i = 0; i < numOfBubbles; i++){
    const projectName = projects[Object.keys(projects)[i]].name;
    const projectDescription = projects[Object.keys(projects)[i]].description;
    const projectLinks = projects[Object.keys(projects)[i]].links;

    if(i === 0) {
      bubbles.push(loadBubble(0, 0, projectName, projectDescription, projectLinks))
      row++;
    } else if(i % 2 === 0) {
      bubbles.push(loadBubble(row + xConst, row * (row * yConst), projectName, projectDescription, projectLinks))
      row++;
    } else {
      bubbles.push(loadBubble(-(row + xConst), row * (row * yConst), projectName, projectDescription, projectLinks))
    };
  };
};

export default {
  bubbles,
  BUBBLESCALE,
  populateBubbles
};