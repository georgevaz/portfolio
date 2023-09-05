import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import colors from './_colors.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Loader
const iconLoader = new SVGLoader();

const createIcon = (icon, callback) => {
  iconLoader.load(icon, // url
    // on load
    (icon) => {
      const paths = icon.paths;
      for(let i = 0; i < paths.length; i++){
        const path = paths[i];

        const material = new THREE.MeshBasicMaterial({
          color: black,
          side: THREE.DoubleSide,
          depthWrite: true
        });

        const shapes = SVGLoader.createShapes(path);

        for(let j = 0; j < shapes.length; j++){
          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);
          callback(mesh);
        }
      };
    },
    // on progress
    undefined,
    // on error
    (error) => {
      console.error(error);
    },
  );
};

export default { createIcon };