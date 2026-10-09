const enc = (s) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
const tree = (x, y, s, c) =>
  `<rect x='${x - 3 * s}' y='${y}' width='${6 * s}' height='${26 * s}' fill='#3b2c1a'/><circle cx='${x}' cy='${y}' r='${22 * s}' fill='${c}'/><circle cx='${x - 15 * s}' cy='${y + 9 * s}' r='${15 * s}' fill='${c}'/><circle cx='${x + 15 * s}' cy='${y + 9 * s}' r='${15 * s}' fill='${c}'/>`;
const rows = (c1, c2) =>
  [0, 1, 2]
    .map((r) =>
      Array.from({ length: 6 + r * 2 }, (_, i) =>
        tree(
          40 + i * (520 / (5 + r * 2)) + (r % 2) * 20,
          250 + r * 62,
          0.7 + r * 0.35,
          r % 2 ? c1 : c2,
        ),
      ).join(""),
    )
    .join("");
const sky = (a, b, sun) =>
  `<defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='600' height='450' fill='url(#s)'/><circle cx='430' cy='130' r='46' fill='${sun}' opacity='.9'/>`;
const hills = (c) =>
  `<path d='M0 260q150-70 300-20t300-30v240H0z' fill='${c}'/>`;
const kinds = {
  grove: (p) => sky(p[0], p[1], p[2]) + hills(p[3]) + rows(p[4], p[5]),
  branch: (p) =>
    `<rect width='600' height='450' fill='${p[0]}'/><path d='M-10 380C150 300 330 280 620 90' stroke='#5b4527' stroke-width='9' fill='none'/>` +
    Array.from({ length: 9 }, (_, i) => {
      const x = 60 + i * 60,
        y = 350 - i * 30 - (i % 2) * 22;
      return `<ellipse cx='${x}' cy='${y - 38}' rx='11' ry='46' fill='${p[1]}' transform='rotate(${i % 2 ? 35 : -40} ${x} ${y})'/><ellipse cx='${x + 12}' cy='${y + 26}' rx='15' ry='20' fill='${p[2]}'/>`;
    }).join(""),
  bottle: (p) =>
    `<rect width='600' height='450' fill='${p[0]}'/><rect y='330' width='600' height='120' fill='${p[1]}'/><rect x='255' y='70' width='36' height='46' rx='6' fill='#222'/><path d='M258 112h30v40c34 24 44 50 44 92v100a18 18 0 0 1-18 18h-82a18 18 0 0 1-18-18V244c0-42 10-68 44-92z' fill='${p[2]}'/><rect x='238' y='250' width='70' height='80' rx='5' fill='#fbfaf0'/><text x='273' y='300' text-anchor='middle' font-family='Georgia' font-size='20' fill='#2f3a14'>Anéli</text>` +
    [
      [400, 360],
      [430, 372],
      [470, 358],
    ]
      .map(
        ([x, y]) =>
          `<ellipse cx='${x}' cy='${y}' rx='16' ry='20' fill='${p[3]}'/>`,
      )
      .join(""),
  mill: (p) =>
    sky(p[0], p[1], p[2]) +
    `<rect y='360' width='600' height='90' fill='${p[3]}'/><rect x='150' y='190' width='260' height='170' fill='#d9cfae'/><path d='M130 195l150-85 150 85z' fill='#8a4b2d'/><rect x='260' y='270' width='50' height='90' rx='25' fill='#4a3a24'/><circle cx='460' cy='300' r='58' fill='none' stroke='#6b5030' stroke-width='10'/><path d='M460 242v116M402 300h116' stroke='#6b5030' stroke-width='8'/>` +
    tree(70, 300, 1.1, p[4]),
  pour: (p) =>
    `<rect width='600' height='450' fill='${p[0]}'/><path d='M300 40c-6 80-10 130 0 190' stroke='${p[1]}' stroke-width='12' stroke-linecap='round'/><ellipse cx='300' cy='330' rx='150' ry='40' fill='${p[2]}'/><path d='M150 330c0 90 60 100 150 100s150-10 150-100z' fill='${p[3]}'/><ellipse cx='300' cy='330' rx='130' ry='30' fill='${p[1]}'/>`,
};
export const scene = (kind, p) =>
  enc(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 450' preserveAspectRatio='xMidYMid slice'>${kinds[kind](p)}</svg>`,
  );
export const gallery = [
  {
    src: scene("grove", [
      "#F6E3A8",
      "#FBF3D6",
      "#F0B73A",
      "#9DB04A",
      "#5E7524",
      "#3F4D17",
    ]),
    alt: "Olive grove at sunrise",
    wide: true,
  },
  {
    src: scene("branch", ["#F4ECD3", "#6B7F23", "#2B3510"]),
    alt: "Olive branch with ripe olives",
  },
  {
    src: scene("bottle", ["#E7D9A3", "#B8860B", "#C9A227", "#2B3510"]),
    alt: "Bottle of Anéli oil with olives",
  },
  {
    src: scene("mill", ["#F2C879", "#FBF3D6", "#FFF1B8", "#7A8F2A", "#4B5A1C"]),
    alt: "The mill",
    wide: true,
  },
  {
    src: scene("pour", ["#F4ECD3", "#D9A521", "#4B5A1C", "#6B7F23"]),
    alt: "Oil being poured",
  },
  {
    src: scene("grove", [
      "#C8663A",
      "#F2B27A",
      "#FFE2A0",
      "#5E7524",
      "#2B3510",
      "#3F4D17",
    ]),
    alt: "Grove at dusk",
  },
  {
    src: scene("branch", ["#2B3510", "#B9C65A", "#6B7F23"]),
    alt: "Green olives, early harvest",
  },
  {
    src: scene("bottle", ["#F4ECD3", "#C9A227", "#B8860B", "#4B5A1C"]),
    alt: "The extra virgin range",
  },
];
