import * as THREE from 'three';

import colors from './_colors.js';
import icons from './_icons.js';
import iconLoader from './iconLoader.js';

// Colors
const { black, white, grayDark, gray, grayLight, red, cream } = colors;

// Icons
const { resumeIcon, githubIcon, linkedInIcon, dogboneIcon } = icons;

// Icon Color
const iconColor = black;
const hamburgerColor = red;

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

  icon.children.forEach(mesh => mesh.material.opacity = 0);
};

const loadHamburgerIcons = () => {
  createIcon(
    dogboneIcon,
    'hamburger',
    hamburgerColor,
    (icon) => {
      setHamburgerIcons(icon, .008, new THREE.Vector3(0, 0, .03));
      hamburgerGroup.add(icon);
      // Load the icons within the callback so that we make sure the hamburger icon loads first before the rest
      Object.keys(linkIcons).forEach(key => {
        createIcon(
          linkIcons[key].icon,
          key,
          iconColor,
          (icon) => {
            setHamburgerIcons(icon, .007, new THREE.Vector3(0, 0, 0));
            hamburgerGroup.add(icon);
          },
          linkIcons[key].link,
        );
      });
    },
    undefined,
  );

};

loadHamburgerIcons();

export default { hamburgerGroup };