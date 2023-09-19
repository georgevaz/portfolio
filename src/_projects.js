import icons from './_icons.js';

// Icons
const { githubIcon, browserIcon, searchIcon, videoIcon } = icons;

const projects = {
  'zukeeper': {
    name: 'Zukeeper',
    description: 'Developer Tools for Zustand',
    links: {
      website: {
        url: 'https://www.zukeeper-tools.com/',
        icon: browserIcon,
      },
      github: {
        url: 'https://github.com/oslabs-beta/Zukeeper',
        icon: githubIcon,
      },
    },
    images: [
      './public/assets/images/zukeeper-0.gif',
      './public/assets/images/zukeeper-1.gif',
      './public/assets/images/zukeeper-2.gif',
      './public/assets/images/zukeeper-3.gif',
      './public/assets/images/zukeeper-4.png',
    ],
  },
  'armoire': {
    name: 'Armoire',
    description: 'Closet Management Application',
    links: {
    },
    images: [

    ],
  },
  'pet-friend-finder': {
    name: 'Pet Friend Finder',
    description: 'Shelter Dog Searching Application',
    links: {
      website: {
        url: 'https://georgevaz.github.io/pet-friend-finder/',
        icon: browserIcon,
      },
      github: {
        url: 'https://github.com/georgevaz/pet-friend-finder',
        icon: githubIcon,
      }
    },
    images: [

    ],
  },
  'crop-dust': {
    name: 'Crop Dust',
    description: 'Fast-Paced Farming Game',
    links: {
      website: {
        url: 'https://george-vaz.itch.io/crop-dust',
        icon: browserIcon,
      },
      video: {
        url: 'https://www.youtube.com/watch?v=OkJlKYUMYXA',
        icon: videoIcon,
      },
    },
    images: [

    ],
  },
  'tube-disasters': {
    name: 'Tube Disasters',
    description: 'FPS RPG Game',
    links: {
      website: {
        url: 'https://george-vaz.itch.io/tube-disasters',
        icon: browserIcon,
      },
      video: {
        url: 'https://www.youtube.com/watch?v=hJZeeUEZmWA',
        icon: videoIcon,
      },
    },
    images: [

    ],
  },
};

export default projects;