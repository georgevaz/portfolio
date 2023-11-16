import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

// Loader
const loader = new SVGLoader();

export const loadSVG = async SVGURL => {
  const result = await loader.loadAsync(SVGURL, //url
  // on load
  SVG => SVG,
  // on progress
  undefined,
  // on error
  error => console.log(error)
  );
  return result;
};