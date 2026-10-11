const base = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});
export const Pencil = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);
export const Trash = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
export const Mail = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
export const Lock = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
export const Check = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
export const Dashboard = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);
export const Box = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.3 7L12 12l8.7-5" />
    <path d="M12 22V12" />
  </svg>
);
export const Bag = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
export const Chart = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M3 3v18h18" />
    <path d="M7 16v-6" />
    <path d="M12 16V6" />
    <path d="M17 16v-3" />
  </svg>
);
export const User = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
export const Logout = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);
export const Menu = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const Close = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
export const Plus = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Chevron = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const Sun = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const Moon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
export const External = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6" />
    <path d="M10 14L21 3" />
  </svg>
);
export const Euro = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M18 7a7 7 0 1 0 0 10" />
    <path d="M4 10h10M4 14h10" />
  </svg>
);
export const Clock = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const Search = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
export const Printer = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M6 9V3h12v6" />
    <rect x="6" y="14" width="12" height="7" rx="1" />
    <path d="M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
  </svg>
);
