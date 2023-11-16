import { FontLoader } from 'three/addons/loaders/FontLoader.js';

// Loader
const loader = new FontLoader();

export const loadFont = async fontURL => {
  const result = await loader.loadAsync(fontURL, //url
  // on load
  font => font,
  // on progress
  undefined,
  // on error
  error => console.log(error)
  );
  return result;
};