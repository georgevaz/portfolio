import TWEEN from '@tweenjs/tween.js';

const onOpacityProp = {
  opacity: 1,
};

const offOpacityProp = {
  opacity: 0,
};

const bubbleTweenOnScaleProp = {
  x: 2,
  y: 2,
  z: 2,
};

const bubbleTweenOffScaleProp = bubbleScale => {
  return {
    x: bubbleScale[0],
    y: bubbleScale[1],
    z: bubbleScale[2],
  }
};

const bubbleTweenOnPositionProp = {
  x: 0,
  y: -6, // -4
  z: 0.25,
};

const bubbleTweenMockScaleProp = {
  x: 3,
  y: 3,
  z: 3,
};

const bubbleTweenMockPositionProp = {
  x: 0,
  y: -9,
  z: 0.25,
};

const tweenObject = (property, propChange, timing, easeType, delay=0) => {
  return new TWEEN.Tween(property)
    .to(propChange, timing)
    .easing(easeType)
    .delay(delay)
    .start()
};

export { 
  onOpacityProp, 
  offOpacityProp, 
  bubbleTweenOnScaleProp, 
  bubbleTweenOffScaleProp, 
  bubbleTweenOnPositionProp,
  bubbleTweenMockScaleProp,
  bubbleTweenMockPositionProp,
  tweenObject 
};