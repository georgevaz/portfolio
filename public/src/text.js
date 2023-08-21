import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import colors from './_colors.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Font Loader
const fontLoader = new FontLoader();

// Font Paths
const stratos = './fonts/Stratos_Regular.json';

// Font Sizes
const h1 = 0.4;
const h2 = 0.2;

// Group
const textGroup = new THREE.Group();

const loadFont = () => {
  createText(stratos, h1, -3.5, 3.5, "Hi, I'm George", (text) => textGroup.add(text));
  createText(stratos, h2, -3.68, 3, "I’m a software engineer", (text) => textGroup.add(text));
  createText(stratos, h1, 3.23, -3, "and this is Ollie!", (text) => textGroup.add(text));
  createText(stratos, h2, 1.95, -3.5, "he’s a dog", (text) => textGroup.add(text));
};

const createText = (fontType, fontSize, xPos, yPos, textCopy, callback) => {
  fontLoader.load(fontType, // url
    //on load
    (font) => {
      const geometry = new TextGeometry(textCopy, {
        font,
        size: fontSize,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: .01,
        bevelSize: .01,
        bevelOffset: 0,
        bevelSegments: 5
      });
      const material = new THREE.MeshPhongMaterial({ color: grayDark });
      const text = new THREE.Mesh(geometry, material);
      text.name = textCopy;

      // center the text, and then move it
      geometry.center();
      text.position.x = xPos;
      text.position.y = yPos;

      text.material.transparent = true;
      text.material.opacity = 0.0;

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
  stratos,
  h1, h2,
  textGroup,
  createText
}