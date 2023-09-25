import * as THREE from 'three';

import icons from './_icons.js';
import iconLoader from './iconLoader.js';

// Icons
const { resumeIcon, githubIcon, linkedInIcon, hamburgerIcon } = icons;

// Icon Loader
const { createIcon } = iconLoader

let hamburgerGroup = new THREE.Group();
hamburgerGroup.position.set(4.25, 3.5, 0);
hamburgerGroup.name = 'hamburger';

const linkIcons = {
  'resume': {
    'icon': resumeIcon,
    'link': 'https://docs.google.com/document/d/1CISCVHahnWOm-hUVWqcMS_UxoKkvxOOpUnPa9ZaTZrA/edit?usp=sharing',
  },
  'github': {
    'icon': githubIcon,
    'link': 'https://github.com/georgevaz',
  },
  'linkedIn': {
    'icon': linkedInIcon,
    'link': 'https://www.linkedin.com/in/georgehvazquez/',
  },
}

const setHamburgerIcons = (icon, scale, position) => {
  // SVG default size is huge
  icon.scale.set(scale, scale, scale)
  
  // Needs to be rotated because of how the file imported
  icon.rotation.x = THREE.MathUtils.degToRad(180);

  // Needs to be positioned
  icon.position.set(position.x, position.y, position.z);

  icon.children.forEach(mesh => mesh.material.opacity = 0)
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

      setHamburgerIcons(icon, .008, new THREE.Vector3(0, 0, .01))
      hamburgerGroup.add(icon);
    },
    undefined
  );

  Object.keys(linkIcons).forEach(key => {
    createIcon(
      linkIcons[key].icon,
      key,
      (icon) => {
        setHamburgerIcons(icon, .005, new THREE.Vector3(0, 0, 0))

        hamburgerGroup.add(icon);
      },
      linkIcons[key].link,
    );
  });
};

loadHamburgerIcons();

export default { hamburgerGroup };