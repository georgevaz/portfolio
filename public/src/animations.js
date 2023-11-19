import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

import { black, grayDark, gray, red, cream } from './_colors.js';
import { STRATOS, h1, h2, textGroup, createText } from './createText.js';
import { BUBBLESCALE, bubbles } from './bubble.js';
import { addMockDiv, removeMockDiv } from './mockUp.js';
import { 
  onOpacityProp, 
  offOpacityProp, 
  bubbleTweenOnScaleProp, 
  bubbleTweenOffScaleProp, 
  bubbleTweenOnPositionProp,
  bubbleTweenMockScaleProp,
  bubbleTweenMockPositionProp,
  tweenObject 
} from './tween.js';

// Text Colors
const textColor = black;

let introAnimationFinished = false;

let hamburgerClicked = false;

const separateObject = object => {
  let titles = object.children.filter(child => child.name === 'titleText');
  let descriptions = object.getObjectByName("description").children.filter(child => child.name === 'descriptionText');
  let descriptionIcons = object.getObjectByName("description").children.filter(child => child.name === 'icon');

  return { titles, descriptions, descriptionIcons };
};

const applyOpacityTween = (prop, arrayOfObjects, arrayOfGroupedIcons) => {
  arrayOfObjects.forEach(object => {
    object.forEach(child => {
      tweenObject(child.material, prop, 200, TWEEN.Easing.Back.Out);
    });
  });

  // icons are special because they are grouped thus needing to access its children further
  arrayOfGroupedIcons.forEach(groupedIcons => {
    groupedIcons.forEach(icon => {
      icon.children.forEach(mesh => {
        tweenObject(mesh.material, prop, 200, TWEEN.Easing.Back.Out);
      });
    });
  });
};

const introAnimation = (hamburgerGroup, ollie) => {
  tweenObject(textGroup.children[0].material, onOpacityProp, 1000, TWEEN.Easing.Linear.None, 1000)
    .onComplete(
      () => tweenObject(textGroup.children[1].material, onOpacityProp, 1000, TWEEN.Easing.Linear.None, 500)
      .onComplete(
        () => tweenObject(ollie.table.children[0].material, onOpacityProp, 1000, TWEEN.Easing.Linear.None, 200)
        .onComplete(
          () => tweenObject(ollie.olliePaws.position, {z: 0.15}, 1000, TWEEN.Easing.Exponential.Out, 250)
          .onComplete(
            () => tweenObject(ollie.ollieBody.position, {z: 0.05}, 700, TWEEN.Easing.Cubic.Out, 200)
            .onComplete(
              () => tweenObject(ollie.ollieBody.position, {z: 0.15}, 500, TWEEN.Easing.Bounce.Out)
              .onComplete(
                () => tweenObject(textGroup.children[2].material, onOpacityProp, 1000, TWEEN.Easing.Linear.None, 500)
                .onComplete(
                  () => tweenObject(textGroup.children[3].material, onOpacityProp, 1000, TWEEN.Easing.Linear.None, 500)
                  .onComplete(
                    () => {

                      // This shows the bubbles
                      bubbles.forEach(bubble => {
                        bubble.children.forEach(child => {
                          // change opacity for the entire bubble except description and icons, which will only appear when clicked
                          if(child.name !== 'description') tweenObject(child.material, onOpacityProp, 250, TWEEN.Easing.Linear.None, 500);
                        });
                      });

                      // This shows the hamburger
                      hamburgerGroup.children.forEach(icon => {
                        if(icon.iconType === 'hamburger'){
                          icon.children.forEach(mesh => {
                            if(icon.name !== 'clickCube')tweenObject(mesh.material, onOpacityProp, 250, TWEEN.Easing.Linear.None, 500);
                          });
                        };
                      });

                      introAnimationFinished = true;
                      bubbles.forEach(bubble => idleAnimation(
                        bubble, 
                        {y: bubble.position.y - 0.1}, 
                        Math.floor(Math.random() * (5000 - 3000 + 1) + 3000)
                        )
                      );
                      idleAnimation(ollie.ollieBody, {z: ollie.ollieBody.position.z + 0.1}, 1000);
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
  const { titles, descriptions, descriptionIcons } = separateObject(object);

  if(isClicked){
    object.idleTween.stop();

    titles.forEach((title, i) => {
      let titleScale = title.lineSpace ? .7 : .8
      tweenObject(title.scale, {
        x: titleScale,
        y: titleScale,
        z: titleScale,
      }, 200, TWEEN.Easing.Back.Out)
      tweenObject(title.position, {
        z: title.lineSpace ? -3.65 + (i * .6 * title.lineSpace) : -3.5,
      }, 200, TWEEN.Easing.Back.Out)
    });
    applyOpacityTween(onOpacityProp, [descriptions], [descriptionIcons]);

    tweenObject(object.scale, bubbleTweenOnScaleProp, 200, TWEEN.Easing.Back.Out);
    tweenObject(object.position, bubbleTweenOnPositionProp, 200, TWEEN.Easing.Back.Out);

  } else {
    object.idleTween.start();

    titles.forEach(title => {
      tweenObject(title.scale, {
        x: 1,
        y: 1,
        z: 1,
      }, 200, TWEEN.Easing.Back.Out, 200);
      tweenObject(title.material, onOpacityProp, 200, TWEEN.Easing.Back.Out);
      tweenObject(title.position, title.originalPosition, 200, TWEEN.Easing.Back.Out);
    });

    applyOpacityTween(offOpacityProp, [descriptions], [descriptionIcons]);

    if(document.getElementsByClassName('mockContainer').length) removeMockDiv();

    tweenObject(object.scale, bubbleTweenOffScaleProp(BUBBLESCALE), 200, TWEEN.Easing.Back.Out);
    tweenObject(object.position, object.originalPosition, 200, TWEEN.Easing.Back.Out);
  };
};

const idleAnimation = (object, prop, timing) => {
  // store the tween into the bubble object to access later (start/stop)
  object.idleTween = tweenObject(object.position, prop, timing, TWEEN.Easing.Sinusoidal.InOut)
  .repeat(Infinity)
  .yoyo(true);
};

const bubbleStateChangeAnimation = (object, isClicked) => {
  const { titles, descriptions, descriptionIcons } = separateObject(object);
  
  if(isClicked){
    applyOpacityTween(offOpacityProp, [titles, descriptions], [descriptionIcons]);

    addMockDiv(object);
    
    tweenObject(object.scale, bubbleTweenMockScaleProp, 200, TWEEN.Easing.Back.Out);
    tweenObject(object.position, bubbleTweenMockPositionProp, 200, TWEEN.Easing.Back.Out);
  } else {
    applyOpacityTween(onOpacityProp, [titles, descriptions], [descriptionIcons]);
    
    if(document.getElementsByClassName('mockContainer').length) removeMockDiv();
    
    tweenObject(object.scale, bubbleTweenOnScaleProp, 200, TWEEN.Easing.Back.Out);
    tweenObject(object.position, bubbleTweenOnPositionProp, 200, TWEEN.Easing.Back.Out);
  };
};

const hamburgerClickAnimation = object => {
  const iconGroup = object.parent;
  hamburgerClicked = !hamburgerClicked;

  if(hamburgerClicked){
    tweenObject(object.rotation, { z: THREE.MathUtils.degToRad(90) }, 200, TWEEN.Easing.Back.Out);
    iconGroup.children.forEach((icon, i) => {
      if(icon.iconType !== 'hamburger'){
        tweenObject(icon.position, { x: -(i * 0.45) }, 500, TWEEN.Easing.Back.Out);
        icon.children.forEach(mesh => {
          tweenObject(mesh.material, { opacity: 1 }, 500, TWEEN.Easing.Back.Out);
        });
      };
    });
  } else {
    tweenObject(object.rotation, { z: THREE.MathUtils.degToRad(0) }, 200, TWEEN.Easing.Back.Out);
    iconGroup.children.forEach(icon => {
      if(icon.iconType !== 'hamburger'){
        tweenObject(icon.position, { x: 0 }, 500, TWEEN.Easing.Back.Out);
        icon.children.forEach(mesh => {
          tweenObject(mesh.material, { opacity: 0 }, 500, TWEEN.Easing.Back.Out);
        });
      };
    });
  };
};

const iconHoverAnimation = (object, hover) => {
  if(hover) tweenObject(object.scale, { x: object.defaultScale.x * 1.25, y: object.defaultScale.y * 1.25, z: object.defaultScale.z * 1.25 }, 300, TWEEN.Easing.Back.Out,)
  else tweenObject(object.scale, { x: object.defaultScale.x, y: object.defaultScale.y, z: object.defaultScale.z }, 300, TWEEN.Easing.Back.Out,)
};

const ollieBarkAnimation = scene => {
  if(introAnimationFinished){
    createText(
      {
        fontType: STRATOS, 
        fontSize: h2,
        fontThickness: 0.1,
        xPos: Math.random() * (Math.round(Math.random()) ? 1 : -1) - .35, 
        yPos: 0, 
        textCopy: Math.round(Math.random()) ? 'woof' : 'bark', 
        textColor,
      }, 
      (text) => {
        text.material.opacity = 1;
        scene.add(text);
        tweenObject(text.position, {y: 1}, 1000, TWEEN.Easing.Linear.None);
        tweenObject(text.material, offOpacityProp, 1000, TWEEN.Easing.Linear.None)
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
};

export {
  introAnimation,
  bubbleClickAnimation,
  idleAnimation,
  bubbleStateChangeAnimation,
  hamburgerClickAnimation,
  iconHoverAnimation,
  ollieBarkAnimation,
};