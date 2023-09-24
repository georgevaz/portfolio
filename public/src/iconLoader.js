import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import colors from './_colors.js';

// Colors
const { black, white, grayDark, gray, grayLight } = colors

// Loader
const iconLoader = new SVGLoader();

const createIcon = (icon, type, callback, link) => {
  let boundingX;
  let boundingY;

  iconLoader.load(icon, // url
    // on load
    (icon) => {
      const paths = icon.paths;
      const group = new THREE.Group();
      group.name = 'icon';
      group.link = link;
      group.iconType = type

      for(let i = 0; i < paths.length; i++){
        const path = paths[i];
        const material = new THREE.MeshPhongMaterial({
          color: black,
          side: THREE.DoubleSide,
          depthWrite: true,
          transparent: true
        });

        const shapes = SVGLoader.createShapes(path);

        for(let j = 0; j < shapes.length; j++){
          const shape = shapes[j];
          const geometry = new THREE.ShapeGeometry(shape);
          const mesh = new THREE.Mesh(geometry, material);

          geometry.center();

          // measure the height and width of icon to use on invisible cube later
          // since some icons have more than one piece, we have to make sure we are grabbing the largest size
          // typically the shape that encompasses the perimeter
          boundingX = boundingX > geometry.boundingBox.max.x * 2 ? boundingX : geometry.boundingBox.max.x * 2;
          boundingY = boundingY > geometry.boundingBox.max.y * 2 ? boundingY : geometry.boundingBox.max.y * 2;

          group.add(mesh);
        }
      };

      // invisible cube to register clicking
      const geometry = new THREE.BoxGeometry(boundingX, boundingY, 5);
      const material = new THREE.MeshBasicMaterial({
        color: black,
        transparent: true,
        opacity: 0,
        visible: false
      });
      const cube = new THREE.Mesh(geometry, material);
      
      cube.name = 'clickCube';

      group.add(cube)

      callback(group);
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