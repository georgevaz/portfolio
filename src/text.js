import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import TWEEN from '@tweenjs/tween.js'

import colors from './_colors.js'

// Colors
const { white, grayDark, gray, grayLight } = colors

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
  createText(stratos, h1, -3.5, 3.5, "Hi, I'm George");
  createText(stratos, h2, -3.68, 3, "I’m a software engineer");
  createText(stratos, h1, 3.23, -3, "and this is Ollie!");
  createText(stratos, h2, 1.95, -3.5, "he’s a dog");
};

const createText = (fontType, fontSize, xPos, yPos, textCopy) => {
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
      const material = new THREE.MeshPhongMaterial({ color: colors.grayDark });
      const text = new THREE.Mesh(geometry, material);
      text.name = textCopy;

      // center the text, and then move it
      geometry.center();
      text.position.x = xPos;
      text.position.y = yPos;

      text.material.transparent = true;
      text.material.opacity = 0.0;

      textGroup.add(text);
    },
    // on progress
    undefined,
    // on error,
    (error) => {
      console.log(error)
    },
  );
};

const textAnimation = () => {
  let easeChild = (child) =>
    new TWEEN.Tween(child.material)
      .to(
        {
          opacity: 1
        }, 1000
      )
      .easing(TWEEN.Easing.Linear.None)
      .delay(500)
      .start()

  const recurse = (children) => {
    if(children.length === 1) return easeChild(children[0]);
    if(children.length < 1) return undefined;
    easeChild(children[0])
    .onComplete(() => recurse(children.slice(1)));
  };

  recurse(textGroup.children)

  // easeChild(textGroup.children[0])
  //   .onComplete(
  //     () => easeChild(textGroup.children[1])
  //       .onComplete(
  //         () => easeChild(textGroup.children[2])
  //           .onComplete(() => easeChild(textGroup.children[3]))
  //       )
  //   )
};

loadFont();

export default {
  textGroup,
  textAnimation
}