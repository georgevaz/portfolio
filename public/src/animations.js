import TWEEN from '@tweenjs/tween.js';

import text from './text.js';
import ollie from './ollie.js';
import bubble from './bubble.js';

// Text
const { textGroup } = text;

// Ollie
const { olliePaws, ollieBody, table } = ollie;

// Bubble
const { bubbles } = bubble;

const tweenObject = (property, propChange, timing, easeType, delay=0) => 
  new TWEEN.Tween(property)
    .to(propChange, timing)
    .easing(easeType)
    .delay(delay)
    .start()

const animation = () => {
  const textTweenProp = {
    opacity: 1
  };

  tweenObject(textGroup.children[0].material, textTweenProp, 1000, TWEEN.Easing.Linear.None, 500)
    .onComplete(
      () => tweenObject(textGroup.children[1].material, textTweenProp, 1000, TWEEN.Easing.Linear.None, 500)
      .onComplete(
        () => tweenObject(table.children[0].material, textTweenProp, 1000, TWEEN.Easing.Linear.None, 200)
        .onComplete(
          () => tweenObject(olliePaws.position, {z: 0.15}, 1000, TWEEN.Easing.Exponential.Out, 250)
          .onComplete(
            () => tweenObject(ollieBody.position, {z: 0.05}, 700, TWEEN.Easing.Cubic.Out, 200)
            .onComplete(
              () => tweenObject(ollieBody.position, {z: 0.15}, 500, TWEEN.Easing.Bounce.Out)
              .onComplete(
                () => tweenObject(textGroup.children[2].material, textTweenProp, 1000, TWEEN.Easing.Linear.None, 500)
                .onComplete(
                  () => tweenObject(textGroup.children[3].material, textTweenProp, 1000, TWEEN.Easing.Linear.None, 500)
                  .onComplete(
                    () => {
                      bubbles.forEach(bubble => {
                        tweenObject(bubble.children[0].material, textTweenProp, 250, TWEEN.Easing.Linear.None, 500)
                        tweenObject(bubble.children[1].material, textTweenProp, 250, TWEEN.Easing.Linear.None, 500)
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

const bubbleHoverAnimation = (object, prop, tweenProp) => {
  tweenObject(object[prop], tweenProp, 200, TWEEN.Easing.Back.Out, 200)
};

export default { bubbleHoverAnimation, animation };