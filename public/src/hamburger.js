import * as THREE from 'three';

import { black, grayDark, gray, red, cream } from './_colors.js';
import { resumeIcon, githubIcon, linkedInIcon, dogboneIcon } from './_icons.js';
import { createIcon, setIcon } from './createIcon.js';

// Icon Color
const iconColor = black;
const hamburgerColor = red;

export let hamburgerGroup = new THREE.Group();
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

export const loadHamburgerIcons = () => {
  createIcon(
    dogboneIcon,
    'hamburger',
    hamburgerColor,
    icon => {
      setIcon(icon, 0.008, new THREE.Vector3(0, 0, .03), 0, 180);
      hamburgerGroup.add(icon);
      // Load the icons within the callback so that we make sure the hamburger icon loads first before the rest
      Object.keys(linkIcons).forEach(key => {
        createIcon(
          linkIcons[key].icon,
          key,
          iconColor,
          icon => {
            setIcon(icon, 0.007, new THREE.Vector3(0, 0, 0), 0, 180);
            hamburgerGroup.add(icon);
          },
          linkIcons[key].link,
        );
      });
    },
    undefined,
  );
};