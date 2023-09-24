import * as THREE from 'three';

import icons from './_icons.js';
import iconLoader from './iconLoader.js';

// Icons
const { resumeIcon, githubIcon, linkedInIcon, hamburgerIcon} = icons;

// Icon Loader
const { createIcon } = iconLoader

let hamburger = new THREE.Group();
hamburger.name = 'hamburger';

const setHamburgerIcon = (icon, scale, position) => {
  // SVG default size is huge
  icon.scale.set(scale, scale, scale)
  
  // Needs to be rotated because of how the file imported
  icon.rotation.x = THREE.MathUtils.degToRad(180);

  // Needs to be positioned
  icon.position.set(position.x, position.y, position.z);

  icon.children.forEach(mesh => mesh.material.opacity = 1)
};

const loadHamburgerIcons = () => {
  createIcon(
    hamburgerIcon,
    'hamburger',
    (icon) => {
      // the hamburger icon is peculiar because it is technically 3 separate pieces
      // calculating the bounding area of this is a bit harder than the previous icons because of it
      // the fourth child in this icon group is the actual clickable area that needs to be altered specifically for this icon
      let y = -15;
      icon.children.forEach(section => {
        if(section.name === 'clickCube') {
          // need to set the clickable area here
          section.scale.set(section.scale.x + .5, 10, section.scale.z);
        } else {
          section.position.set(0, y, 0);
          y += 15;
        };
      });

      setHamburgerIcon(icon, .008, new THREE.Vector3(0, 0, 0))

      hamburger.position.set(4.25, 3.5, 0);
      hamburger.add(icon);

    },
    undefined
  )
};

loadHamburgerIcons();

export default { hamburger };