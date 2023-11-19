import * as THREE from 'three';

import { black, grayDark, gray, red, cream } from './_colors.js';
import { resumeIcon, githubIcon, linkedInIcon, dogboneIcon } from './_icons.js';
import { createIcon, setIcon } from './createIcon.js';

export class Hamburger {
  constructor() {
    // Icon Color
    this.iconColor = black;
    this.hamburgerColor = red;

    this.hamburgerGroup = new THREE.Group();
    this.hamburgerGroup.position.set(4.25, 3.5, 0);
    this.hamburgerGroup.name = 'hamburger';

    this.linkIcons = {
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
    };
  };

  async loadHamburgerIcons() {
    await createIcon(
      dogboneIcon,
      'hamburger',
      this.hamburgerColor,
      icon => {
        setIcon(icon, 0.008, new THREE.Vector3(0, 0, .03), 0, 180);
        this.hamburgerGroup.add(icon);
        // Load the icons within the callback so that we make sure the hamburger icon loads first before the rest
        Object.keys(this.linkIcons).forEach(async key => {
          await createIcon(
            this.linkIcons[key].icon,
            key,
            this.iconColor,
            icon => {
              setIcon(icon, 0.007, new THREE.Vector3(0, 0, 0), 0, 180);
              this.hamburgerGroup.add(icon);
            },
            this.linkIcons[key].link,
          );
        });
      },
      undefined,
    );
  };
};