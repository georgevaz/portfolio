import TWEEN, { Tween } from '@tweenjs/tween.js';

import colors from './_colors.js';
import text from './textLoader.js';
import ollie from './ollieLoader.js';
import bubble from './bubbleLoader.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Text
const { STRATOS, h1, h2, textGroup, createText } = text;

// Ollie
const { olliePaws, ollieBody, table } = ollie;

// Bubble
const { BUBBLESCALE, bubbles } = bubble;

const tweenObject = (property, propChange, timing, easeType, delay=0) => {
  return new TWEEN.Tween(property)
    .to(propChange, timing)
    .easing(easeType)
    .delay(delay)
    .start()
};

const textTweenOpacityProp = {
  opacity: 1
};

const bubbleTweenOffScaleProp = {
  x: BUBBLESCALE[0],
  y: BUBBLESCALE[1],
  z: BUBBLESCALE[2],
};

const bubbleTweenOnScaleProp = {
  x: 2,
  y: 2,
  z: 2,
};

const bubbleTweenOnPositionProp = {
  x: -.28,
  y: -6, // -4
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
                          // change opacity for the entire bubble except description and icons, which will only appear when clicked
                          if(child.name !== 'description' && child.name !== 'icon') tweenObject(child.material, textTweenOpacityProp, 250, TWEEN.Easing.Linear.None, 500);
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

const bubbleClickAnimation = (object, isClicked) => {
  let titles = object.children.filter(child => child.name === 'title');
  let descriptions = object.children.filter(child => child.name === 'description');
  let icons = object.children.filter(child => child.name === 'icon');

  if(isClicked){
    object.tween.stop();

    titles.forEach((title, i) => {
      let titleScale = title.lineSpace ? .7 : .8
      tweenObject(title.scale, {
        x: titleScale,
        y: titleScale,
        z: titleScale,
      }, 200, TWEEN.Easing.Back.Out, 200)
      tweenObject(title.position, {
        z: title.lineSpace ? -3.65 + (i * .6 * title.lineSpace) : -3.5,
      }, 200, TWEEN.Easing.Back.Out, 200)
    });

    icons.forEach(icon => {
      icon.children.forEach(mesh => {
        tweenObject(mesh.material, {opacity: 1}, 200, TWEEN.Easing.Back.Out, 200);
      });
    });

    descriptions.forEach(description => {
      tweenObject(description.material, {opacity: 1}, 200, TWEEN.Easing.Back.Out, 200);
    })

    tweenObject(object.scale, bubbleTweenOnScaleProp, 200, TWEEN.Easing.Back.Out, 200);
    tweenObject(object.position, bubbleTweenOnPositionProp, 200, TWEEN.Easing.Back.Out, 200);

  } else {
    object.tween.start();

    titles.forEach((title) => {
      tweenObject(title.scale, {
        x: 1,
        y: 1,
        z: 1,
      }, 200, TWEEN.Easing.Back.Out, 200)
      tweenObject(title.position, title.originalPosition, 200, TWEEN.Easing.Back.Out, 200);
    });

    icons.forEach(icon => {
      icon.children.forEach(mesh => {
        tweenObject(mesh.material, {opacity: 0}, 200, TWEEN.Easing.Back.Out, 200);
      });
    });

    descriptions.forEach(description => {
      tweenObject(description.material, {opacity: 0}, 200, TWEEN.Easing.Back.Out, 200);
    });

    tweenObject(object.scale, bubbleTweenOffScaleProp, 200, TWEEN.Easing.Back.Out, 200);
    tweenObject(object.position, object.originalPosition, 200, TWEEN.Easing.Back.Out, 200);

  };
};

const bubbleIdleAnimation = (object) => {
  let randomTiming = Math.floor(Math.random() * (5000 - 3000 + 1) + 3000);
  // store the tween into the bubble object to access later (start/stop)
  object.tween = tweenObject(object.position, {y: object.position.y - .1}, randomTiming, TWEEN.Easing.Sinusoidal.InOut, 200)
  .repeat(Infinity)
  .yoyo(true);
};

const ollieBarkAnimation = (scene) => {
  createText(
    {
      fontType: STRATOS, 
      fontSize: h2,
      fontThickness: 0.1,
      xPos: Math.random() * (Math.round(Math.random()) ? 1 : -1) - .35, 
      yPos: 0, 
      textCopy: Math.round(Math.random()) ? 'woof' : 'bark', 
      textColor: black,
    }, 
    (text) => {
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
    }
  );
};

export default {
  introAnimation,
  bubbleClickAnimation,
  bubbleIdleAnimation,
  ollieBarkAnimation,
};