// Blueprint-style annotations around the hero portrait, chosen per profile.
// Anchors are in the bust's own coordinate space (874 x 620); labels sit to the right.
const A = { ax: 505, ay: 118, ex: 680, ey: 200 };  // hair / forehead
const B = { ax: 668, ay: 392, ex: 760, ey: 330 };  // shoulder
const C = { ax: 585, ay: 548, ex: 700, ey: 566 };  // chest

export const CALLOUTS = {
  hr: [
    { ...A, title: 'B.E. Computer Science', sub: "SIMATS · '23 – '27" },
    { ...B, title: 'CGPA 9.4 / 10', sub: 'Best Student Award 2025' },
    { ...C, title: 'Full Stack Intern', sub: "Cognifyz · May – Jun '25" },
  ],
  recruiter: [
    { ...A, title: 'Java · Spring Boot 3', sub: 'REST APIs, JWT, RBAC' },
    { ...B, title: 'PostgreSQL · JPA', sub: 'Layered architecture' },
    { ...C, title: '5 projects shipped', sub: 'Live demos below' },
  ],
  developer: [
    { ...A, title: 'Layered backends', sub: 'Controller · Service · Repo' },
    { ...B, title: 'JWT + role-based auth', sub: 'Spring Security patterns' },
    { ...C, title: 'React front-ends', sub: 'TypeScript · Tailwind' },
  ],
  visitor: [
    { ...A, title: 'Hi, I build for the web', sub: 'Backend first' },
    { ...B, title: 'Chennai, India', sub: "Graduating '27" },
    { ...C, title: '5 live projects', sub: 'Scroll to explore' },
  ],
};
CALLOUTS.owner = CALLOUTS.recruiter;
