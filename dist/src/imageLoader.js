import * as THREE from 'three';

const createImage = () => {
  const texture = new THREE.TextureLoader().load('./assets/Zukeeper-1.gif');
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshLambertMaterial( { map: texture } );
  const geometry = new THREE.PlaneGeometry(5, 5*.5)
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(0,0,5);

  return  mesh;

};

export default { createImage };