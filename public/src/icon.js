import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import colors from './_colors.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

const iconLoader = new SVGLoader();

const createIcon = () => {
  const group = new THREE.Group();

  iconLoader.load('./assets/github.svg', // url
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
          group.add(mesh);
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
  // SVG default size is huge
  group.scale.set(.1, .1, .1)

  // Needs to be rotated because of how the file imported
  group.rotation.x = THREE.MathUtils.degToRad(180);

  return group;
};

export default { createIcon };