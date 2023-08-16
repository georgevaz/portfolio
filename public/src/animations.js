import TWEEN from '@tweenjs/tween.js'

import text from './text.js'
import ollie from './ollie.js'
import bubble from './bubble.js'

// Text
const { textGroup } = text;

// Ollie
const { olliePaws, ollieBody, table } = ollie;

// Bubble
const { bubbleGroup } = bubble;

const tweenObject = (property, propChange, timing, easeType, delay=0) => 
  new TWEEN.Tween(property)
    .to(propChange, timing)
    .easing(easeType)
    .delay(delay)
    .start()

const recursiveTween = (children) => {
  if(children.length === 1) return easeChild(children[0]);
  if(children.length < 1) return undefined;
  tweenObject(children[0])
  .onComplete(() => recursiveTween(children.slice(1)));
};

const animation = () => {
  const textTweenProp = {
    opacity: 1
  };
  // tweenObject(bubbleGroup.children[0].children[0].material, textTweenProp, 1000, TWEEN.Easing.Linear.None, 500)

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
                    tweenObject(bubbleGroup.children[0].children[0].material, textTweenProp, 1000, TWEEN.Easing.Linear.None, 500)
                    tweenObject(bubbleGroup.children[0].children[1].material, textTweenProp, 1000, TWEEN.Easing.Linear.None, 500)
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

export default { animation };