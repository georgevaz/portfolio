import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Loader
const loader = new GLTFLoader();

export const loadGLTF = async GLTFURL => {
  const result = await loader.loadAsync(GLTFURL, //url
  // on load
  GLTF => GLTF,
  // on progress
  undefined,
  // on error
  error => console.log(error)
  );
  return result;
};