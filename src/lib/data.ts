/* ============================================================
   VELORA INTERNATIONAL — demo content
   A trade atelier of hand-raised metalware. Moradabad, since 1972.
   All content is illustrative.
   ============================================================ */

export const BRAND = {
  name: "Velora International",
  shortName: "Velora",
  descriptor: "Métaux d'Art",
  founded: 1972,
  city: "Moradabad",
  region: "Uttar Pradesh, India",
  tagline: "Heirloom objects in brass, bronze & silver.",
  email: "trade@velora.example",
  phone: "+91 (000) 000 0000",
  hours: "Mon–Sat · 9:30–18:30 IST",
  address: "Civil Lines, Moradabad, Uttar Pradesh 244001, India",
};

export type Tone = "brass" | "copper" | "bronze" | "silver";
export type Shape =
  | "bowl"
  | "vase"
  | "ewer"
  | "urn"
  | "platter"
  | "lamp"
  | "box"
  | "goblet"
  | "candelabra"
  | "tray";

export const NAV = [
  { label: "Collections", href: "/collections" },
  { label: "About Us", href: "/about" },
  { label: "Connect", href: "/connect" },
];

export interface Collection {
  slug: string;
  name: string;
  material: string;
  count: number;
  tagline: string;
  blurb: string;
  tone: Tone;
  index: string;
  /** Optional cover image — /media/collections/<slug>.jpg. Falls back to SVG art. */
  cover?: string;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "lighting",
    name: "Lighting",
    material: "Brass & Bronze",
    count: 64,
    tagline: "Light & shadow",
    blurb:
      "Lamps, lanterns and wall sconces raised entirely by hand. Brass and bronze shaped to carry a warm, living light — and to throw shadow as deliberately as glow.",
    tone: "brass",
    index: "I",
  },
  {
    slug: "decor",
    name: "Decor",
    material: "Copper & Bronze",
    count: 48,
    tagline: "Objects for the room",
    blurb:
      "Vases, bowls and sculptural pieces in copper and bronze, patinated to deep, living colour. The considered objects that give a room its centre of gravity.",
    tone: "copper",
    index: "II",
  },
  {
    slug: "kitchenware",
    name: "Kitchenware",
    material: "Copper & Silver",
    count: 39,
    tagline: "The considered table",
    blurb:
      "Servingware, ewers and footed plate in tinned copper and silver — made for the table and made to last. Quiet, formal, set entirely by hand.",
    tone: "silver",
    index: "III",
  },
  {
    slug: "accessories",
    name: "Accessories",
    material: "Bronze & Brass",
    count: 49,
    tagline: "Small luxuries",
    blurb:
      "Boxes, trays and desk objects — the small, weighty luxuries that finish a space. Architectural in detail, intimate in the hand.",
    tone: "bronze",
    index: "IV",
  },
];

export interface Specimen {
  ref: string;
  slug: string;
  name: string;
  collection: string; // collection slug
  material: string;
  tone: Tone;
  shape: Shape;
  finish: string;
  dims: string;
  leadTime: string;
  price: string;
  year: number;
  maker: string;
  edition: string;
  desc: string;
  story: string;
  tags: string[];
  featured?: boolean;
  /* ── Manual media (optional) ──────────────────────────────
     Drop files in /public/media/specimens and point to them here.
     When absent, the hand-built SVG art renders instead.
       image:   "/media/specimens/surya-footed-bowl.jpg"
       video:   "/media/specimens/surya-footed-bowl.mp4"  (muted, looping)
       poster:  fallback frame for the video (defaults to `image`)
       gallery: extra stills shown on the detail page              */
  image?: string;
  video?: string;
  poster?: string;
  gallery?: string[];
}

export const SPECIMENS: Specimen[] = [
  {
    ref: "V—2207",
    slug: "surya-footed-bowl",
    name: "Surya Footed Bowl",
    collection: "lighting",
    material: "Hand-raised brass",
    tone: "brass",
    shape: "bowl",
    finish: "Mirror-burnished",
    dims: "180 mm · Ø 320",
    leadTime: "6–8 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Iqbal A.",
    edition: "Open · made to order",
    desc:
      "A wide footed bowl raised from a single disc of brass and burnished to a still mirror by one maker over eleven days.",
    story:
      "Named for the sun it throws back across a room, the Surya is the maison's signature in brass — the piece by which a maker is judged. The rim is burnished last, by eye, until the line disappears.",
    tags: ["Centrepiece", "Signature"],
    featured: true,
  },
  {
    ref: "V—1184",
    slug: "noor-temple-ewer",
    name: "Noor Temple Ewer",
    collection: "lighting",
    material: "Hand-raised brass",
    tone: "brass",
    shape: "ewer",
    finish: "Satin lacquer",
    dims: "340 mm · 1.4 L",
    leadTime: "7–9 weeks",
    price: "Trade price on application",
    year: 2023,
    maker: "Rafiq M.",
    edition: "Open · made to order",
    desc:
      "A long-necked ewer with a drawn spout and a single raised handle, chased with a fine running line at the shoulder.",
    story:
      "Drawn from a temple form four centuries old, the Noor's spout is raised, not cast — the hardest move in the workshop, and the reason it is given only to senior hands.",
    tags: ["Pouring", "Heritage"],
    featured: true,
  },
  {
    ref: "V—3092",
    slug: "atlas-urn",
    name: "Atlas Urn",
    collection: "lighting",
    material: "Hand-raised brass",
    tone: "brass",
    shape: "urn",
    finish: "Antiqued",
    dims: "520 mm · Ø 300",
    leadTime: "9–12 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Studio raise",
    edition: "Limited · 24 per year",
    desc:
      "A two-handled urn at architectural scale, antiqued to a low, even glow and weighted to stand without plinth.",
    story:
      "The Atlas is the largest vessel the maison raises in a single piece. Two makers work the body in turn over three weeks; the handles are forged separately and brazed by the master.",
    tags: ["Statement", "Floor"],
    featured: true,
  },
  {
    ref: "V—2671",
    slug: "halo-charger-platter",
    name: "Halo Charger",
    collection: "lighting",
    material: "Hand-raised brass",
    tone: "brass",
    shape: "platter",
    finish: "Hammered",
    dims: "Ø 410",
    leadTime: "5–7 weeks",
    price: "Trade price on application",
    year: 2023,
    maker: "Sundar L.",
    edition: "Open · made to order",
    desc:
      "A broad charger with a planished surface — thousands of small hammer-faces catching light like water.",
    story:
      "Each facet is struck by hand against a stake. Under candlelight the Halo reads as a single moving surface; under daylight, as a field of tiny mirrors.",
    tags: ["Table", "Planished"],
  },
  {
    ref: "V—2310",
    slug: "lumen-table-lamp",
    name: "Lumen Table Lamp",
    collection: "accessories",
    material: "Brass & parchment",
    tone: "brass",
    shape: "lamp",
    finish: "Satin lacquer",
    dims: "460 mm · Ø 240",
    leadTime: "8–10 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Atelier no.3",
    edition: "Open · made to order",
    desc:
      "A raised brass column beneath a hand-stitched parchment shade; switched, wired and certified to order by region.",
    story:
      "The Lumen pairs the workshop's oldest craft with its newest department. The base is raised in brass; the shade is cut, soaked and stitched over a brass frame by a single hand.",
    tags: ["Lighting", "Hospitality"],
    featured: true,
  },
  {
    ref: "V—4405",
    slug: "verde-bottle-vase",
    name: "Verde Bottle Vase",
    collection: "decor",
    material: "Hand-raised copper",
    tone: "copper",
    shape: "vase",
    finish: "Verdigris patina",
    dims: "300 mm · Ø 140",
    leadTime: "6–8 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Pooja D.",
    edition: "Open · made to order",
    desc:
      "A slender copper bottle drawn to a long neck and patinated to a soft verdigris green over a copper ground.",
    story:
      "The Verde is the only piece in which the maison lets the metal turn. Patina is grown, not painted — coaxed with heat and salt over a week, then sealed at the moment the colour is right.",
    tags: ["Verdigris", "Stems"],
    featured: true,
  },
  {
    ref: "V—4188",
    slug: "ember-cauldron-bowl",
    name: "Ember Cauldron",
    collection: "decor",
    material: "Hand-raised copper",
    tone: "copper",
    shape: "bowl",
    finish: "Antiqued",
    dims: "220 mm · Ø 360",
    leadTime: "7–9 weeks",
    price: "Trade price on application",
    year: 2023,
    maker: "Rafiq M.",
    edition: "Open · made to order",
    desc:
      "A deep, low cauldron in copper with a rolled rim and an oxblood antiqued interior.",
    story:
      "Raised from a single heavy disc, the Ember keeps the warmth of the fire it was made over. The interior is darkened by hand so the metal reads as embers seen from above.",
    tags: ["Centrepiece", "Copper"],
  },
  {
    ref: "V—4520",
    slug: "rosa-tray",
    name: "Rosa Serving Tray",
    collection: "decor",
    material: "Copper & bronze",
    tone: "copper",
    shape: "tray",
    finish: "Satin",
    dims: "440 × 300 mm",
    leadTime: "5–7 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Sundar L.",
    edition: "Open · made to order",
    desc:
      "A rounded-rectangle tray in copper with cast bronze handles and a softly satined face.",
    story:
      "The Rosa marries two metals: a copper field raised for warmth, bronze handles cast for weight. The join is brazed and dressed until it cannot be felt.",
    tags: ["Service", "Mixed metal"],
  },
  {
    ref: "V—5031",
    slug: "claire-goblet",
    name: "Claire Goblet",
    collection: "kitchenware",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "goblet",
    finish: "Silver-plated",
    dims: "180 mm · 240 ml",
    leadTime: "6–8 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Atelier no.5",
    edition: "Open · made to order",
    desc:
      "A stemmed goblet raised in brass and silver-plated to a cool, even shine; sold in pairs or in service.",
    story:
      "The Claire is set for the table where candlelight matters. The bowl is raised thin for the lip, the stem drawn solid for balance — a piece that feels right before it is filled.",
    tags: ["Table", "Pairs"],
    featured: true,
  },
  {
    ref: "V—5092",
    slug: "selene-ewer",
    name: "Selene Ewer",
    collection: "kitchenware",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "ewer",
    finish: "Mirror-burnished",
    dims: "300 mm · 1.0 L",
    leadTime: "8–10 weeks",
    price: "Trade price on application",
    year: 2023,
    maker: "Rafiq M.",
    edition: "Open · made to order",
    desc:
      "A formal water ewer with a high handle and a mirror lip, silvered to catch the moon it is named for.",
    story:
      "Selene is the maison's most photographed piece — a single curve from foot to spout with no break the eye can find. The mirror is burnished, not buffed, so the reflection stays deep.",
    tags: ["Pouring", "Formal"],
  },
  {
    ref: "V—5410",
    slug: "lune-footed-plate",
    name: "Lune Footed Plate",
    collection: "kitchenware",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "platter",
    finish: "Satin",
    dims: "Ø 300 · h 70",
    leadTime: "6–8 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Sundar L.",
    edition: "Open · made to order",
    desc:
      "A raised, footed plate with a soft satin face — for the centre of a table or the top of a console.",
    story:
      "The Lune lifts what it carries a few quiet centimetres above the cloth. The foot is spun and the well raised, then married so the line is unbroken.",
    tags: ["Table", "Footed"],
  },
  {
    ref: "V—6203",
    slug: "monsoon-box",
    name: "Monsoon Box",
    collection: "accessories",
    material: "Brass & bronze",
    tone: "bronze",
    shape: "box",
    finish: "Antiqued",
    dims: "120 × 180 × 80 mm",
    leadTime: "7–9 weeks",
    price: "Trade price on application",
    year: 2023,
    maker: "Pooja D.",
    edition: "Open · made to order",
    desc:
      "A lidded box in brass with a cast bronze handle, antiqued to the colour of wet earth before rain.",
    story:
      "The Monsoon closes with a weight you feel before you hear it. The lid is fitted by hand to the body so the two breathe as one — a fraction of a second of resistance, then silence.",
    tags: ["Object", "Lidded"],
  },
  {
    ref: "V—6377",
    slug: "atlas-candelabra",
    name: "Atlas Candelabra",
    collection: "accessories",
    material: "Hand-raised brass",
    tone: "brass",
    shape: "candelabra",
    finish: "Mirror-burnished",
    dims: "420 mm · 5 light",
    leadTime: "10–12 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Studio raise",
    edition: "Limited · 18 per year",
    desc:
      "A five-light candelabra with raised cups and forged arms that spring from a single turned stem.",
    story:
      "Each arm is forged hot and dressed cold until all five sit at exactly one height. Lit, the Atlas throws a low gold ceiling across a room — the maison's most requested commission piece.",
    tags: ["Lighting", "Statement"],
    featured: true,
  },
  {
    ref: "V—3318",
    slug: "ravi-incense-urn",
    name: "Ravi Incense Urn",
    collection: "lighting",
    material: "Hand-raised brass",
    tone: "brass",
    shape: "urn",
    finish: "Hammered",
    dims: "260 mm · Ø 160",
    leadTime: "6–8 weeks",
    price: "Trade price on application",
    year: 2023,
    maker: "Iqbal A.",
    edition: "Open · made to order",
    desc:
      "A small two-handled urn, pierced and planished, made to hold heat and let scent rise.",
    story:
      "The Ravi is pierced with a pattern the maker chooses each time, so no two breathe alike. The hammer-marks hold the warmth of the coal it carries.",
    tags: ["Ritual", "Pierced"],
  },
  {
    ref: "V—4710",
    slug: "terra-planter",
    name: "Terra Planter",
    collection: "decor",
    material: "Hand-raised copper",
    tone: "copper",
    shape: "urn",
    finish: "Verdigris patina",
    dims: "360 mm · Ø 340",
    leadTime: "8–10 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Atelier no.3",
    edition: "Open · made to order",
    desc:
      "A broad copper planter patinated to a mottled verdigris, lined and sealed for living plants.",
    story:
      "The Terra is made to keep aging after it leaves us. Watered and weathered, the green deepens for years — a piece designed, unusually, to be improved by use.",
    tags: ["Garden", "Verdigris"],
  },
  {
    ref: "V—2890",
    slug: "aurum-vase",
    name: "Aurum Vase",
    collection: "lighting",
    material: "Hand-raised brass",
    tone: "brass",
    shape: "vase",
    finish: "Mirror-burnished",
    dims: "380 mm · Ø 160",
    leadTime: "7–9 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Rafiq M.",
    edition: "Open · made to order",
    desc:
      "A tall, narrow-shouldered vase burnished to a deep mirror — for a single architectural stem.",
    story:
      "The Aurum is raised to a wall thinness most makers will not attempt, then burnished until the body becomes a column of light. Shown empty as often as filled.",
    tags: ["Stems", "Mirror"],
  },
  {
    ref: "V—6601",
    slug: "noir-table-lamp",
    name: "Noir Table Lamp",
    collection: "accessories",
    material: "Blackened brass",
    tone: "bronze",
    shape: "lamp",
    finish: "Blackened",
    dims: "520 mm · Ø 260",
    leadTime: "9–11 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Atelier no.3",
    edition: "Open · made to order",
    desc:
      "A raised column lamp blackened to a soft graphite, beneath a deep linen-wrapped shade.",
    story:
      "The Noir is the Lumen's evening twin — the same raised column, chemically blackened and waxed so the metal reads as shadow with a brass heart beneath.",
    tags: ["Lighting", "Blackened"],
  },
  {
    ref: "V—5560",
    slug: "perle-goblet-set",
    name: "Perle Goblet · Set of Six",
    collection: "kitchenware",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "goblet",
    finish: "Mirror-burnished",
    dims: "160 mm · 200 ml",
    leadTime: "8–10 weeks",
    price: "Trade price on application",
    year: 2023,
    maker: "Atelier no.5",
    edition: "Open · made to order",
    desc:
      "A service of six raised goblets, each hand-matched for height, weight and tone before it leaves the bench.",
    story:
      "A set is harder than a single. The Perle six are raised in one sitting by one maker so the family resemblance is real — matched, not merely measured.",
    tags: ["Table", "Set"],
  },
  {
    ref: "V—6748",
    slug: "lyra-tray",
    name: "Lyra Drinks Tray",
    collection: "accessories",
    material: "Brass & bronze",
    tone: "bronze",
    shape: "tray",
    finish: "Mirror-burnished",
    dims: "500 × 340 mm",
    leadTime: "6–8 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Sundar L.",
    edition: "Open · made to order",
    desc:
      "A generous drinks tray in mirror brass with low forged-bronze gallery rails.",
    story:
      "The Lyra carries a full service without complaint. The rails are forged proud of the face so a glass finds its edge in the dark — function dressed as ornament.",
    tags: ["Service", "Bar"],
  },
  {
    ref: "V—3540",
    slug: "soleil-charger",
    name: "Soleil Charger",
    collection: "lighting",
    material: "Hand-raised brass",
    tone: "brass",
    shape: "platter",
    finish: "Satin",
    dims: "Ø 360",
    leadTime: "5–7 weeks",
    price: "Trade price on application",
    year: 2023,
    maker: "Iqbal A.",
    edition: "Open · made to order",
    desc:
      "A satin-faced charger chased with a fine sunburst that reveals itself only at an angle.",
    story:
      "The Soleil hides its ornament in plain light and gives it up at a tilt. The rays are chased from the back, so the surface stays smooth to the hand.",
    tags: ["Table", "Chased"],
  },
  {
    ref: "V—4960",
    slug: "amber-bottle",
    name: "Amber Bottle Vase",
    collection: "decor",
    material: "Hand-raised bronze",
    tone: "bronze",
    shape: "vase",
    finish: "Antiqued",
    dims: "280 mm · Ø 150",
    leadTime: "7–9 weeks",
    price: "Trade price on application",
    year: 2024,
    maker: "Pooja D.",
    edition: "Open · made to order",
    desc:
      "A rounded bronze bottle antiqued to deep amber, with a turned collar at the neck.",
    story:
      "The Amber holds its colour in the metal, not on it. Bronze is darkened slowly until it reaches the gold-brown of old resin, then sealed and left honest.",
    tags: ["Stems", "Bronze"],
  },
];

export interface Finish {
  name: string;
  note: string;
  swatch: string; // css gradient
}

export const FINISHES: Finish[] = [
  {
    name: "Mirror-burnished",
    note: "Worked to a still, deep reflection — the maison's signature.",
    swatch: "linear-gradient(135deg,#7b5a26,#c8a765 40%,#fff3d6 52%,#a77e36 70%,#6f4f20)",
  },
  {
    name: "Satin",
    note: "A soft, even sheen that hides fingerprints and ages slowly.",
    swatch: "linear-gradient(135deg,#8a6a2e,#b89255,#9c7c46)",
  },
  {
    name: "Antiqued",
    note: "Darkened by hand into the recesses; high points left bright.",
    swatch: "linear-gradient(135deg,#3a2c14,#6e5230,#9c7c46)",
  },
  {
    name: "Hammered",
    note: "Planished facets that read as a field of small mirrors.",
    swatch: "linear-gradient(135deg,#6f4f20,#c8a765,#7b5a26,#dcc089)",
  },
  {
    name: "Verdigris patina",
    note: "Grown with heat and salt — living copper green, then sealed.",
    swatch: "linear-gradient(135deg,#2f4a3f,#5e7d6e,#9c5b38)",
  },
  {
    name: "Blackened",
    note: "Chemically darkened to graphite, waxed over a brass heart.",
    swatch: "linear-gradient(135deg,#16130d,#3a3026,#5c4a30)",
  },
  {
    name: "Silver-plated",
    note: "A cool, even silver over raised brass — set for candlelight.",
    swatch: "linear-gradient(135deg,#8d8f90,#e8e9ea 52%,#9fa0a0)",
  },
];

export interface Step {
  n: string;
  title: string;
  body: string;
}

export const PROCESS: Step[] = [
  {
    n: "01",
    title: "The disc",
    body: "Every piece begins as a flat disc of sheet metal and a fire. The maker chooses the gauge by the object it will become — and by hand, never machine.",
  },
  {
    n: "02",
    title: "Raising",
    body: "Struck thousands of times against a stake, the flat sheet climbs into a vessel. The metal hardens as it rises and is annealed in fire to soften it again — over and over, for days.",
  },
  {
    n: "03",
    title: "Chasing",
    body: "Line and ornament are walked into the surface with hammer and punch — from the front for relief, from the back for repoussé. Each maker's hand is recognisable to the others.",
  },
  {
    n: "04",
    title: "Patina",
    body: "Colour is drawn from the metal with heat, time and a few quiet chemistries — antique, oxblood, verdigris or blackened — then arrested at the exact moment it is right.",
  },
  {
    n: "05",
    title: "Burnish",
    body: "The surface is brought to its final lustre by hand against stone and steel. A piece is finished not when the clock says so, but when the maker can find nothing left to improve.",
  },
];

export const STATS = [
  { value: 54, suffix: "", label: "Years of the maison", sub: "Est. 1972" },
  { value: 120, suffix: "", label: "Master artisans", sub: "Many, second-generation" },
  { value: 18, suffix: "", label: "Countries served", sub: "Quietly, often unbranded" },
  { value: 2400, suffix: "", label: "Pieces made each year", sub: "Each, by a single hand" },
];

export const PRINCIPLES = [
  {
    n: "01",
    title: "Made by hand",
    body: "No mass tooling. Each object is raised, chased and finished by a single maker, start to finish.",
  },
  {
    n: "02",
    title: "Made to order",
    body: "We make what is needed, when it is needed — low minimums, little waste, no warehouse of unwanted stock.",
  },
  {
    n: "03",
    title: "Made to last",
    body: "Solid metal, honest joins, finishes that age into patina rather than wear out. Objects that outlive their owners.",
  },
];

export interface Service {
  title: string;
  body: string;
  tone: Tone;
}

export const SERVICES: Service[] = [
  {
    title: "Statement pieces",
    body: "Sculpture, centrepieces and lighting at architectural scale — the object a room is designed around.",
    tone: "brass",
  },
  {
    title: "Private label",
    body: "Your collection, raised under your name and full confidentiality. Your form, your finish, your mark.",
    tone: "silver",
  },
  {
    title: "Hospitality",
    body: "Amenity and tableware programmes built to last a property, with reorder history and lead-time visibility.",
    tone: "copper",
  },
  {
    title: "Restoration",
    body: "Re-raising, re-plating and re-patination of heirloom metal — bringing inherited pieces back to standard.",
    tone: "bronze",
  },
];

export const COMMISSION_STEPS: Step[] = [
  { n: "01", title: "The conversation", body: "Tell us the project — form, finish, scale and use. We reply within two working days with an indicative timeline." },
  { n: "02", title: "Drawing & sample", body: "We draw the piece and raise a sample to your hand. Nothing goes into production until the sample is right." },
  { n: "03", title: "The making", body: "A single maker carries each object from sheet to lustre. You receive progress as the work moves through the atelier." },
  { n: "04", title: "Finishing & marking", body: "Patina, burnish and — if private label — your mark, struck or engraved to specification." },
  { n: "05", title: "Crate & freight", body: "Documentation, crating and freight are handled end to end from Moradabad to your door." },
];

export const ATELIERS = [
  {
    name: "The Raising Hall",
    place: "Civil Lines, Moradabad",
    note: "Where sheet becomes vessel — the oldest room in the workshop, and the loudest.",
  },
  {
    name: "The Finishing Room",
    place: "Civil Lines, Moradabad",
    note: "Patina, plating and burnish. Kept quiet and warm; the work here is slow and final.",
  },
  {
    name: "The Trade Desk & Showroom",
    place: "Civil Lines, Moradabad",
    note: "Sampling, pricing and the full catalogue. Visits by appointment.",
  },
];

export const PRESS = [
  { quote: "The last workshop raising vessels of this scale entirely by hand.", source: "The Design Review" },
  { quote: "Velora's brass has the weight of something inherited rather than bought.", source: "Maison & Objet Journal" },
  { quote: "A trade secret among the interior architects who know.", source: "Interior Atlas" },
];

export const TRADE_POINTS = [
  {
    title: "Private label & bespoke",
    body: "Your designs, your mark. We produce to specification under full confidentiality.",
  },
  {
    title: "Export to 18 countries",
    body: "Documentation, crating and freight handled end to end from Moradabad.",
  },
  {
    title: "MOQ from six pieces",
    body: "Low minimums for designers and galleries; volume tiers for retail.",
  },
  {
    title: "A dedicated trade desk",
    body: "One contact, sampling, lead-time visibility and full reorder history.",
  },
];

export const MATERIAL_FILTERS = [
  "All",
  "Brass",
  "Copper",
  "Bronze",
  "Silver",
];

/* ---------- Journal ---------- */
export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  dateLabel: string;
  readTime: string;
  tone: Tone;
  shape: Shape;
  body: { heading?: string; text: string }[];
}

export const JOURNAL: Article[] = [
  {
    slug: "the-eleven-day-bowl",
    title: "The eleven-day bowl",
    excerpt:
      "A single maker, a single disc of brass, eleven days. The making of the Surya — the piece by which a Velora maker is judged.",
    category: "The Craft",
    date: "2026-05-18",
    dateLabel: "May 2026",
    readTime: "6 min",
    tone: "brass",
    shape: "bowl",
    body: [
      { text: "It begins, as everything here does, with a flat disc and a fire. The maker chooses the gauge by feel — too thin and the rim will not hold its line; too thick and the metal fights the hammer for a week longer than it should." },
      { heading: "Raising", text: "Over the first four days the disc climbs into a vessel, struck thousands of times against a steel stake. The brass work-hardens as it rises and must be annealed in the fire to soften again — a rhythm of heat and hammer that cannot be hurried." },
      { heading: "The rim", text: "The last thing finished is the rim, burnished by eye until the join disappears. A maker who cannot make the rim vanish does not yet make the Surya. It is, quietly, the maison's examination." },
      { text: "Eleven days after the disc was cut, the bowl throws the room back at itself. Nothing about it was rushed; nothing about it was repeated exactly. That is the whole of the method, and the whole of the point." },
    ],
  },
  {
    slug: "why-we-let-copper-turn",
    title: "Why we let copper turn",
    excerpt:
      "Most workshops fight oxidation. We grow it — coaxing verdigris from copper with heat, salt and time, then arresting it at the exact right moment.",
    category: "Material",
    date: "2026-04-02",
    dateLabel: "April 2026",
    readTime: "5 min",
    tone: "copper",
    shape: "vase",
    body: [
      { text: "Copper wants to change. Left alone it dulls, then darkens, then — given air and moisture and years — turns the soft blue-green the French call verdigris and the rest of us call the colour of old roofs and older statues." },
      { heading: "Grown, not painted", text: "On the Verde and the Terra we let it happen on purpose, but on our schedule. The patina is coaxed with heat and a few quiet chemistries over a week, watched daily, and sealed at the precise moment the colour is right. A day late and it is wrong." },
      { heading: "Designed to keep changing", text: "The Terra planter is the rare object made to keep aging after it leaves us. Watered and weathered, its green deepens for years — a piece, unusually, designed to be improved by use." },
    ],
  },
  {
    slug: "made-under-another-name",
    title: "Made under another name",
    excerpt:
      "For three generations we have made objects that carry someone else's mark. A note on private label, confidentiality, and quiet pride.",
    category: "Trade",
    date: "2026-02-20",
    dateLabel: "February 2026",
    readTime: "4 min",
    tone: "silver",
    shape: "ewer",
    body: [
      { text: "Walk through certain hotels, certain galleries, certain very good rooms, and you will find our work — though you will rarely find our name. Much of what we make is private label: your form, your finish, your mark." },
      { heading: "Confidence, kept", text: "We produce to specification under full confidentiality. A design that arrives at our bench stays at our bench. For many of our partners that discretion is the whole arrangement." },
      { heading: "The standard is the signature", text: "When our name is not on a piece, the only thing vouching for it is the standard. Which is exactly why we hold to one we would put our own name to — because, often, we quietly do." },
    ],
  },
  {
    slug: "a-room-built-around-an-object",
    title: "A room built around an object",
    excerpt:
      "On statement pieces — the candelabra, the urn, the lamp at architectural scale — and what it means to design a space around a single made thing.",
    category: "Design",
    date: "2026-01-12",
    dateLabel: "January 2026",
    readTime: "5 min",
    tone: "bronze",
    shape: "candelabra",
    body: [
      { text: "Most objects fit into a room. A few are the reason the room exists. The Atlas urn, raised in a single piece at floor scale, is one of these; so is the five-light Atlas candelabra, which throws a low gold ceiling across a table the moment it is lit." },
      { heading: "Scale and intimacy", text: "Architectural in scale, intimate in the hand — that contradiction is the brief for every statement piece. It must hold a room from across it and reward you when you finally stand close." },
      { heading: "Made to be inherited", text: "Solid metal, honest joins, finishes that age into patina rather than wear out. The best compliment a statement piece can earn is to outlive the room it was made for, and the one after that." },
    ],
  },
];

export function getArticle(slug: string) {
  return JOURNAL.find((a) => a.slug === slug);
}

/* ---------- FAQ ---------- */
export interface FaqItem {
  q: string;
  a: string;
}
export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ: FaqGroup[] = [
  {
    title: "Ordering & minimums",
    items: [
      { q: "What is the minimum order?", a: "Six pieces per line for trade — low enough for designers and galleries, with volume tiers for retail. Bespoke commissions can begin at a single statement piece." },
      { q: "What are your lead times?", a: "Most catalogue pieces are made to order in six to eight weeks. Larger or limited pieces, and bespoke work, run eight to twelve. Every order is hand-raised, so timing reflects real making, not a warehouse." },
      { q: "Can I request a sample first?", a: "Yes. For bespoke and private-label work we raise a sample to your hand and nothing goes into production until it is right. Catalogue samples are available to trade accounts on request." },
    ],
  },
  {
    title: "Trade & pricing",
    items: [
      { q: "How do I open a trade account?", a: "Tell us a little about your business through the Trade Enquiry form. Our trade desk sets you up with pricing, samples and a dedicated contact, usually within two working days." },
      { q: "How is pricing shown?", a: "Trade pricing is on application — it depends on finish, quantity and freight. Catalogue listings show specification rather than price for this reason." },
      { q: "Do you offer private label?", a: "Yes. We produce to your specification under full confidentiality — your form, your finish, your mark — from a single collection to an ongoing programme." },
    ],
  },
  {
    title: "Shipping & customs",
    items: [
      { q: "Where do you ship?", a: "We export to eighteen countries and counting. Documentation, crating and freight are handled end to end from Moradabad." },
      { q: "Who handles duties and customs?", a: "We prepare full export documentation and can ship on common Incoterms. Import duties and local taxes are typically the buyer's responsibility; our trade desk will advise per destination." },
      { q: "How are pieces packed?", a: "Each piece is wrapped, braced and crated for the metal it is — solid objects, packed to survive freight and arrive as they left the bench." },
    ],
  },
  {
    title: "Caring for your metal",
    items: [
      { q: "How do I clean brass and copper?", a: "A soft, dry cloth is usually enough. For lacquered finishes, never use metal polish — it removes the lacquer. For raw finishes, an occasional gentle brass cleaner restores the shine; or let the metal mellow, which many prefer." },
      { q: "Will the finish change over time?", a: "It is meant to. Antiqued and raw finishes deepen into patina; verdigris pieces keep growing their colour. Lacquered and silver-plated pieces hold their tone longest. None of it wears out — it ages." },
      { q: "Can you restore an older piece?", a: "Yes — re-raising, re-plating and re-patination of heirloom metal is part of what we do. Send us photographs through the Bespoke enquiry and we will advise." },
    ],
  },
];

/* ---------- media ----------
   Optional, manually-added imagery. See /public/media/README.md. */
export function hasMedia(s: Specimen) {
  return Boolean(s.image || s.video);
}

export const HERO_MEDIA: { image?: string; video?: string } = {
  // image: "/media/hero/hero.jpg",
  // video: "/media/hero/hero.mp4",
};

/* ---------- selectors ---------- */
export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
export function getSpecimen(slug: string) {
  return SPECIMENS.find((s) => s.slug === slug);
}
export function specimensByCollection(slug: string) {
  return SPECIMENS.filter((s) => s.collection === slug);
}
export function featuredSpecimens() {
  return SPECIMENS.filter((s) => s.featured);
}
export function relatedSpecimens(slug: string, n = 3) {
  const me = getSpecimen(slug);
  if (!me) return SPECIMENS.slice(0, n);
  const same = SPECIMENS.filter(
    (s) => s.slug !== slug && s.collection === me.collection,
  );
  const rest = SPECIMENS.filter(
    (s) => s.slug !== slug && s.collection !== me.collection,
  );
  return [...same, ...rest].slice(0, n);
}
export const TICKER = [
  "Brass",
  "Copper",
  "Bronze",
  "Silver",
  "Hand-raised",
  "Moradabad",
  "Patinated",
  "Repoussé",
  "Burnished",
  "Made to order",
];
