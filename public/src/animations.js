import TWEEN, { Tween } from '@tweenjs/tween.js';

import colors from './_colors.js';
import text from './text.js';
import ollie from './ollie.js';
import bubble from './bubble.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Text
const { STRATOS, h1, h2, textGroup, createText } = text;

// Ollie
const { olliePaws, ollieBody, table } = ollie;

// Bubble
const { BUBBLESCALE, bubbles } = bubble;

const tweenObject = (property, propChange, timing, easeType, delay=0) => 
  new TWEEN.Tween(property)
    .to(propChange, timing)
    .easing(easeType)
    .delay(delay)
    .start()

const textTweenOpacityProp = {
  opacity: 1
};

const bubbleTweenOffScaleProp = {
  x: BUBBLESCALE[0],
  y: BUBBLESCALE[1],
  z: BUBBLESCALE[2],
};

const bubbleTweenOnScaleProp = {
  x: 1.5,
  y: 1.5,
  z: 1.5,
};

const bubbleTweenOnPositionProp = {
  x: -.28,
  y: -4,
  z: 0.25,
};

const introAnimation = () => {

  tweenObject(textGroup.children[0].material, textTweenOpacityProp, 1000, TWEEN.Easing.Linear.None, 500)
    .onComplete(
      () => tweenObject(textGroup.children[1].material, textTweenOpacityProp, 1000, TWEEN.Easing.Linear.None, 500)
      .onComplete(
        () => tweenObject(table.children[0].material, textTweenOpacityProp, 1000, TWEEN.Easing.Linear.None, 200)
        .onComplete(
          () => tweenObject(olliePaws.position, {z: 0.15}, 1000, TWEEN.Easing.Exponential.Out, 250)
          .onComplete(
            () => tweenObject(ollieBody.position, {z: 0.05}, 700, TWEEN.Easing.Cubic.Out, 200)
            .onComplete(
              () => tweenObject(ollieBody.position, {z: 0.15}, 500, TWEEN.Easing.Bounce.Out)
              .onComplete(
                () => tweenObject(textGroup.children[2].material, textTweenOpacityProp, 1000, TWEEN.Easing.Linear.None, 500)
                .onComplete(
                  () => tweenObject(textGroup.children[3].material, textTweenOpacityProp, 1000, TWEEN.Easing.Linear.None, 500)
                  .onComplete(
                    () => {
                      bubbles.forEach(bubble => {
                        bubble.children.forEach(child => {
                          tweenObject(child.material, textTweenOpacityProp, 250, TWEEN.Easing.Linear.None, 500);
                        })
                      })
                    }
                  )
                )
              )
            )  
          )
        )
      )
    );
};

const bubbleAnimation = (object, isClicked) => {
  if(isClicked){
    tweenObject(object.scale, bubbleTweenOnScaleProp, 200, TWEEN.Easing.Back.Out, 200);
    tweenObject(object.position, bubbleTweenOnPositionProp, 200, TWEEN.Easing.Back.Out, 200);
  } else {
    tweenObject(object.scale, bubbleTweenOffScaleProp, 200, TWEEN.Easing.Back.Out, 200);
    tweenObject(object.position, object.originalPosition, 200, TWEEN.Easing.Back.Out, 200);
  };
};

const ollieBarkAnimation = (scene) => {
  createText(STRATOS, h2, Math.random() * (Math.round(Math.random()) ? 1 : -1) - .35, 0, Math.round(Math.random()) ? 'woof' : 'bark', black, (text) => {
    text.material.opacity = 1;
    scene.add(text);
    tweenObject(text.position, {y: 1}, 1000, TWEEN.Easing.Linear.None);
    tweenObject(text.material, {opacity: 0}, 1000, TWEEN.Easing.Linear.None)
    .onComplete(
      () => {
        text.geometry.dispose();
        text.material.dispose();
        scene.remove(text);
      }
    );
  });
};

export default {
  introAnimation,
  bubbleAnimation,
  ollieBarkAnimation,
};