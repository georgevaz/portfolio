import * as THREE from 'three';

const createImage = (url, width, callback) => {
  const texture = new THREE.TextureLoader().load(url);
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshLambertMaterial({ 
    map: texture,
    transparent: true
  });
  const geometry = new THREE.PlaneGeometry(width, width*.5)

  geometry.center();

  const mesh = new THREE.Mesh( geometry, material );

  callback(mesh);
};

export default { createImage };