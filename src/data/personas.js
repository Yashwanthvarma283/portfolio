// Single source of truth for the profile picker and what each profile sees.
// `sections` is the render order after the hero; ids map to components in App.jsx.
export const PERSONAS = {
  owner: {
    id: 'owner',
    name: 'Yashwanth Varma',
    blurb: 'Owner · sign in to edit',
    welcome: 'Owner view',
    sections: ['snapshot', 'about', 'experience', 'projects', 'capstones', 'credentials', 'contact'],
  },
  hr: {
    id: 'hr',
    name: 'HR',
    blurb: 'Education, credentials, resume',
    welcome: 'Prepared for HR and hiring teams',
    sections: ['snapshot', 'experience', 'credentials', 'contact'],
  },
  recruiter: {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Skills, live projects, experience',
    welcome: 'Prepared for recruiters',
    sections: ['snapshot', 'projects', 'experience', 'credentials', 'contact'],
  },
  developer: {
    id: 'developer',
    name: 'Developer',
    blurb: 'Code, stacks, repositories',
    welcome: 'Prepared for engineers',
    sections: ['projects', 'capstones', 'about', 'experience', 'contact'],
  },
  visitor: {
    id: 'visitor',
    name: 'Visitor',
    blurb: 'The story and the work',
    welcome: 'Welcome',
    sections: ['about', 'projects', 'credentials', 'contact'],
  },
};

export const PICKER_ORDER = ['owner', 'hr', 'recruiter', 'developer', 'visitor'];

export const SECTION_LABELS = {
  snapshot: 'Snapshot',
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  capstones: 'Capstones',
  credentials: 'Credentials',
  contact: 'Contact',
};
