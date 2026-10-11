export const photos = {
  arrive: "/images/olives-arrive.jpg",
  conveyor: "/images/olives-conveyor.jpg",
  mesh: "/images/olives-mesh.jpg",
  paste: "/images/olive-paste.jpg",
  oil: "/images/fresh-oil.jpg",
};

export const shots = [
  { src: photos.arrive, pos: "50% 50%" },
  { src: photos.conveyor, pos: "50% 30%" },
  { src: photos.mesh, pos: "50% 50%" },
  { src: photos.paste, pos: "50% 50%" },
  { src: photos.oil, pos: "50% 55%" },
];

export const copy = {
  en: {
    intro: "From olive to oil: a look inside our mill.",
    ui: {
      open: "Open photo",
      close: "Close",
      prev: "Previous photo",
      next: "Next photo",
    },
    shots: [
      ["Olives arrive", "The harvest comes in and moves up the line."],
      ["On the conveyor", "Fresh olives travelling through the mill."],
      ["Fresh olives", "Green olives on their way to the next step."],
      ["Olive paste", "Crushed olives, ready for the oil to be extracted."],
      ["Fresh oil", "Green-gold oil, straight from the mill."],
    ],
  },
  sq: {
    intro: "Nga ulliri te vaji: një vështrim brenda mullirit tonë.",
    ui: {
      open: "Hap foton",
      close: "Mbyll",
      prev: "Foto e mëparshme",
      next: "Foto tjetër",
    },
    shots: [
      ["Ullinjtë mbërrijnë", "Vjelja hyn dhe ngjitet në linjë."],
      ["Në shiritin transportues", "Ullinj të freskët që kalojnë nëpër mulli."],
      ["Ullinj të freskët", "Ullinj të gjelbër rrugës drejt hapit tjetër."],
      ["Pasta e ullirit", "Ullinj të shtypur, gati për nxjerrjen e vajit."],
      ["Vaji i freskët", "Vaj jeshil-ar, direkt nga mulliri."],
    ],
  },
};
