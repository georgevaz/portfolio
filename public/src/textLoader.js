import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import colors from './_colors.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Font Loader
const fontLoader = new FontLoader();

// Font Paths
const STRATOS = './fonts/Stratos_Regular.json';
const ROBOTO = './fonts/Roboto_Regular.json';

// Font Sizes
const h1 = 0.4;
const h2 = 0.2;

// Font Extrusion
const fontThickness = 0.1;

// Group
const textGroup = new THREE.Group();

// Callback
const addToGroup = (text) => textGroup.add(text);

const loadFont = () => {
  createText(
    {
      fontType: STRATOS, 
      fontSize: h1,
      fontThickness,
      xPos: -3.5, 
      yPos: 3.5, 
      textCopy: "Hi, I'm George", 
      textColor: grayDark
    }, 
    addToGroup
  );

  createText(
    {
      fontType: STRATOS, 
      fontSize: h2,
      fontThickness,
      xPos: -3.68, 
      yPos: 3, 
      textCopy: "I’m a software engineer", 
      textColor: grayDark
    }, 
    addToGroup
  );

  createText(
    {
      fontType: STRATOS, 
      fontSize: h1, 
      fontThickness,
      xPos: 3.23, 
      yPos: -3, 
      textCopy: "and this is Ollie!", 
      textColor: grayDark
    },
    addToGroup
  );

  createText(
    {
      fontType: STRATOS, 
      fontSize: h2,
      fontThickness,
      xPos: 2.3, 
      yPos: -3.5, 
      textCopy: "he’s a good boy", 
      textColor: grayDark
    },
    addToGroup
  );
};

const createText = (textAttributes, callback, name='text', opacity=0) => {
  const { fontType, fontThickness, fontSize, xPos, yPos, textCopy, textColor } = textAttributes;
  fontLoader.load(fontType, // url
    //on load
    (font) => {
      const geometry = new TextGeometry(textCopy, {
        font,
        size: fontSize,
        height: fontThickness,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .01,
        bevelSize: .01,
        bevelOffset: 0,
        bevelSegments: 5
      });
      const material = new THREE.MeshPhongMaterial({ 
        color: textColor,
        transparent: true,
        opacity: opacity
      });
      const text = new THREE.Mesh(geometry, material);
      text.name = name;
      text.textCopy = textCopy;

      // center the text, and then move it
      geometry.center();
      text.position.x = xPos;
      text.position.y = yPos;

      callback(text);
    },
    // on progress
    undefined,
    // on error,
    (error) => {
      console.log(error)
    },
  );
};

loadFont();

export default {
  STRATOS,
  ROBOTO,
  h1, h2,
  textGroup,
  createText
}