import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import { loadSVG } from './_SVGLoader';

export const createIcon = async (iconURL, type, color, callback, link) => {
  let boundingX;
  let boundingY;
  
  const icon = await loadSVG(iconURL);
  const paths = icon.paths;
  const group = new THREE.Group();
  group.name = 'icon';
  group.link = link;
  group.iconType = type;

  for(let i = 0; i < paths.length; i++){
    const path = paths[i];
    const material = new THREE.MeshPhongMaterial({
      color,
      side: THREE.DoubleSide,
      depthWrite: true,
      transparent: true
    });

    const shapes = SVGLoader.createShapes(path);

    for(let j = 0; j < shapes.length; j++){
      const shape = shapes[j];
      const geometry = new THREE.ExtrudeGeometry(shape,
        {
          depth: 6,
          bevelEnabled: false
        });
      const mesh = new THREE.Mesh(geometry, material);

      geometry.center();

      // measure the height and width of icon to use on invisible cube later
      // since some icons have more than one piece, we have to make sure we are grabbing the largest size
      // typically the shape that encompasses the perimeter
      boundingX = boundingX > geometry.boundingBox.max.x * 2 ? boundingX : geometry.boundingBox.max.x * 2;
      boundingY = boundingY > geometry.boundingBox.max.y * 2 ? boundingY : geometry.boundingBox.max.y * 2;

      group.add(mesh);
    };
  };

  // invisible cube to register clicking
  const geometry = new THREE.BoxGeometry(boundingX, boundingY, 5);
  const material = new THREE.MeshBasicMaterial({
    color, // no need for actual color but it is here in case we need to switch it on to view for any reason
    transparent: true,
    opacity: 0,
    visible: false
  });
  const cube = new THREE.Mesh(geometry, material);
  
  cube.name = 'clickCube';

  group.add(cube);

  callback(group);
  
  // Copying the scale in which the icon is instantiated to reference later when animating
  group.defaultScale = {};
  Object.assign(group.defaultScale, group.scale);
};