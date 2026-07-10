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
  /** Filter groups shown within the collection (in order). Omitted = no filter bar. */
  subcategories?: string[];
  /** Optional cover image — /media/catalog/<file>. Falls back to SVG art. */
  cover?: string;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "lighting",
    name: "Lighting",
    material: "Brass, bronze & crystal",
    count: 7,
    tagline: "Light & shadow",
    blurb:
      "Table lamps, candle stands and hurricanes that carry a warm, living light — cast brass and hand-blown glass, lit to throw shadow as deliberately as glow.",
    tone: "brass",
    index: "I",
    subcategories: ["Lamps", "Candle Holders & Stands"],
    cover: "/media/catalog/cover-lighting.png",
  },
  {
    slug: "decor",
    name: "Decor",
    material: "Glass, brass & enamel",
    count: 7,
    tagline: "Objects for the room",
    blurb:
      "Sculptural vases and hand-worked photo frames — smoked glass wrapped in bronze, meenakari enamel, cast birds and branches. The pieces that give a room its centre of gravity.",
    tone: "bronze",
    index: "II",
    subcategories: ["Vases", "Frames"],
    cover: "/media/catalog/cover-decor.png",
  },
  {
    slug: "kitchenware",
    name: "Kitchenware",
    material: "Porcelain, crystal & silver",
    count: 15,
    tagline: "The considered table",
    blurb:
      "Bowls, cake stands, fine bone-china sets and serving trays — dressed for the table and made to be brought out, not put away.",
    tone: "silver",
    index: "III",
    subcategories: ["Bowls", "Cake Stands", "Dinner Sets", "Trays"],
    cover: "/media/catalog/cover-kitchenware.png",
  },
  {
    slug: "accessories",
    name: "Accessories",
    material: "Art glass & painted ceramic",
    count: 13,
    tagline: "Small luxuries",
    blurb:
      "Hand-blown glass creatures, painted figurines and faceted crystal catch-alls — the small, weighted objects that finish a space.",
    tone: "copper",
    index: "IV",
    cover: "/media/catalog/cover-accessories.png",
  },
  {
    slug: "clocks",
    name: "Clocks",
    material: "Crystal, brass & marble",
    count: 2,
    tagline: "Time, kept beautifully",
    blurb:
      "Skeleton movements set in optical crystal and gilded brass — desk clocks that show their workings as openly as they show the hour.",
    tone: "brass",
    index: "V",
    cover: "/media/catalog/cover-clocks.png",
  },
  {
    slug: "wedding",
    name: "Wedding",
    material: "Gilded board, glass & silver",
    count: 22,
    tagline: "The occasion, gift-wrapped",
    blurb:
      "Invitations, shagun boxes, hampers and silver gifting — the trousseau of a celebration, hand-painted and finished for the families who receive them.",
    tone: "silver",
    index: "VI",
    subcategories: ["Invitations", "Invitation Boxes", "Hampers", "Silver Gifting"],
    cover: "/media/catalog/cover-wedding.png",
  },
];

export interface Specimen {
  ref: string;
  slug: string;
  name: string;
  collection: string; // collection slug
  subcategory?: string; // filter group within the collection
  material: string; // short material line — doubles as the card caption
  tone: Tone;
  shape: Shape;
  finish?: string;
  leadTime?: string;
  year?: number;
  maker?: string;
  edition?: string;
  desc: string;
  story: string;
  tags: string[];
  featured?: boolean;
  /* ── Manual media (optional) ──────────────────────────────
     Product photos live in /public/media/catalog and are pointed to here.
     When absent, the hand-built SVG art renders instead.
       image:   "/media/catalog/cheetah-glass-table-lamp.png"
       video:   "/media/catalog/<slug>.mp4"  (muted, looping)
       poster:  fallback frame for the video (defaults to `image`)
       gallery: extra stills shown on the detail page              */
  image?: string;
  video?: string;
  poster?: string;
  gallery?: string[];
}

export const SPECIMENS: Specimen[] = [
  /* ── I · LIGHTING ─────────────────────────────────────────── */
  {
    ref: "VL-01",
    slug: "cheetah-glass-table-lamp",
    name: "Shikar Cheetah Table Lamp",
    collection: "lighting",
    subcategory: "Lamps",
    material: "Cast brass & amber glass",
    tone: "brass",
    shape: "lamp",
    desc: "A hammered amber-glass body on a cast brass cheetah base, crowned with a tapered silk shade.",
    story:
      "The cheetah is caught mid-stride around the stem, so the lamp reads as movement held still. Wired and shade-fitted to order.",
    tags: ["Statement", "Bedside"],
    featured: true,
    image: "/media/catalog/cheetah-glass-table-lamp.png",
  },
  {
    ref: "VL-02",
    slug: "panther-hammered-lamp",
    name: "Panther Hammered Table Lamp",
    collection: "lighting",
    subcategory: "Lamps",
    material: "Hammered metal & velvet",
    tone: "bronze",
    shape: "lamp",
    desc: "A hand-hammered urn in deep gunmetal, a silvered panther climbing its shoulder beneath a black velvet shade.",
    story:
      "The dimpled body scatters lamplight like water; the panther is cast separately and set by hand so it truly grips the curve.",
    tags: ["Statement", "Evening"],
    image: "/media/catalog/panther-hammered-lamp.png",
  },
  {
    ref: "VL-03",
    slug: "twig-hurricane-candle-stand",
    name: "Aviary Twig Hurricane Stand",
    collection: "lighting",
    subcategory: "Candle Holders & Stands",
    material: "Cast bronze & smoked glass",
    tone: "bronze",
    shape: "candelabra",
    desc: "A cast bronze branch, budding with leaves and gilt birds, cradling a smoked-glass hurricane.",
    story:
      "Every leaf and songbird is cast from a real cutting, then the branch is grown around the glass so the flame sits in a little thicket.",
    tags: ["Hurricane", "Nature"],
    image: "/media/catalog/twig-hurricane-candle-stand.png",
  },
  {
    ref: "VL-04",
    slug: "crystal-candelabra-trio",
    name: "Aurelle Crystal Candelabra",
    collection: "lighting",
    subcategory: "Candle Holders & Stands",
    material: "Optical crystal",
    tone: "silver",
    shape: "candelabra",
    desc: "A three-light candelabra cut entirely from optical crystal, arms curving from a faceted spine.",
    story:
      "Solid crystal, cut and polished by hand until the arms disappear into light. Lit, it throws small rainbows across the cloth.",
    tags: ["Table", "Three-light"],
    image: "/media/catalog/crystal-candelabra-trio.png",
  },
  {
    ref: "VL-05",
    slug: "crystal-pillar-candlestick",
    name: "Meridian Crystal Candlestick",
    collection: "lighting",
    subcategory: "Candle Holders & Stands",
    material: "Optical crystal",
    tone: "silver",
    shape: "candelabra",
    desc: "A tall tapered candlestick in faceted crystal, balanced on a single polished sphere.",
    story:
      "The column is cut with long flat facets that catch the flame and lengthen it. Sold singly or paired for a symmetrical table.",
    tags: ["Table", "Pair"],
    image: "/media/catalog/crystal-pillar-candlestick.png",
  },
  {
    ref: "VL-06",
    slug: "onyx-crystal-candle-stand",
    name: "Noir Crystal Candle Stand",
    collection: "lighting",
    subcategory: "Candle Holders & Stands",
    material: "Crystal & black onyx",
    tone: "silver",
    shape: "candelabra",
    desc: "A clear crystal cup above a faceted sphere and a tall cone of jet-black crystal.",
    story:
      "The dark cone anchors the light rather than competing with it — a study in contrast, cut from two crystals in one piece.",
    tags: ["Table", "Contrast"],
    image: "/media/catalog/onyx-crystal-candle-stand.png",
  },
  {
    ref: "VL-07",
    slug: "filigree-hurricane-lantern",
    name: "Coronet Filigree Hurricane",
    collection: "lighting",
    subcategory: "Candle Holders & Stands",
    material: "Glass & silvered filigree",
    tone: "silver",
    shape: "candelabra",
    desc: "A glass hurricane belted with a silvered filigree crown and standing on a beaded foot.",
    story:
      "The pierced band is cut like a little coronet so candlelight throws a lace of shadow onto whatever it stands upon.",
    tags: ["Hurricane", "Filigree"],
    image: "/media/catalog/filigree-hurricane-lantern.png",
  },

  /* ── II · DECOR ───────────────────────────────────────────── */
  {
    ref: "VD-01",
    slug: "sylvan-birds-bud-vase",
    name: "Sylvan Birds Bud Vase",
    collection: "decor",
    subcategory: "Vases",
    material: "Smoked glass & bronze",
    tone: "bronze",
    shape: "vase",
    desc: "A teardrop of smoked glass held in a cast bronze thicket of branches and gilded birds.",
    story:
      "The metalwork is grown up one side of the glass so the vase looks half-reclaimed by the garden it will hold.",
    tags: ["Stems", "Nature"],
    image: "/media/catalog/sylvan-birds-bud-vase.png",
  },
  {
    ref: "VD-02",
    slug: "hummingbird-smoke-vase",
    name: "Hummingbird Smoke-Glass Vase",
    collection: "decor",
    subcategory: "Vases",
    material: "Smoked glass & brass",
    tone: "bronze",
    shape: "vase",
    desc: "A tall smoked-glass vase clasped by a cast brass branch, a hummingbird alighting at the rim.",
    story:
      "Built for long stems — lilies, gladioli — with the brass mount doubling as ballast so a full arrangement never tips.",
    tags: ["Floor", "Statement"],
    featured: true,
    image: "/media/catalog/hummingbird-smoke-vase.png",
  },
  {
    ref: "VD-03",
    slug: "facet-cut-olive-vase",
    name: "Facet Olive Glass Vase",
    collection: "decor",
    subcategory: "Vases",
    material: "Facet-cut glass",
    tone: "bronze",
    shape: "vase",
    desc: "A rounded vase in olive-smoke glass, its whole surface cut into tiny pyramids of light.",
    story:
      "Each diamond facet is ground by hand, so the body glitters like a pineapple of glass whether it is filled or left empty.",
    tags: ["Stems", "Facet-cut"],
    image: "/media/catalog/facet-cut-olive-vase.png",
  },
  {
    ref: "VD-04",
    slug: "panther-hammered-frame",
    name: "Panther Hammered Photo Frame",
    collection: "decor",
    subcategory: "Frames",
    material: "Hammered brass",
    tone: "brass",
    shape: "box",
    desc: "A hand-hammered brass frame with a silvered panther prowling down one edge.",
    story:
      "The dimpled brass is planished by hand; the cat is cast, oxidised dark and set proud of the frame so it casts its own shadow.",
    tags: ["5×7", "Tabletop"],
    image: "/media/catalog/panther-hammered-frame.png",
  },
  {
    ref: "VD-05",
    slug: "blush-blossom-enamel-frame",
    name: "Blush Blossom Enamel Frame",
    collection: "decor",
    subcategory: "Frames",
    material: "Enamelled wood & gold",
    tone: "brass",
    shape: "box",
    desc: "A blush-pink frame hand-painted with lilies and traced in fine gold line.",
    story:
      "Painted in the pichwai manner over a sealed wood ground, then outlined in raised gold so the blossoms sit up from the surface.",
    tags: ["5×7", "Floral"],
    image: "/media/catalog/blush-blossom-enamel-frame.png",
  },
  {
    ref: "VD-06",
    slug: "meenakari-mirror-frame",
    name: "Meenakari Ivory Photo Frame",
    collection: "decor",
    subcategory: "Frames",
    material: "Meenakari enamel",
    tone: "silver",
    shape: "box",
    desc: "An ivory frame worked in blue-and-gold meenakari with a mosaic of tiny mirror triangles.",
    story:
      "The enamel motifs are laid by hand and the mirror border set chip by chip — a technique borrowed from Rajasthani palace doors.",
    tags: ["5×7", "Meenakari"],
    image: "/media/catalog/meenakari-mirror-frame.png",
  },
  {
    ref: "VD-07",
    slug: "hummingbird-branch-frame",
    name: "Hummingbird Branch Photo Frame",
    collection: "decor",
    subcategory: "Frames",
    material: "Cast brass",
    tone: "brass",
    shape: "box",
    desc: "A gilded frame cast as bark, a daffodil and a hummingbird breaking free of the top corner.",
    story:
      "The bird and bloom are modelled full-round and brazed to the branch, so the frame turns a photograph into a little diorama.",
    tags: ["5×7", "Nature"],
    image: "/media/catalog/hummingbird-branch-frame.png",
  },

  /* ── III · KITCHENWARE ────────────────────────────────────── */
  {
    ref: "VK-01",
    slug: "pomegranate-branch-bowl",
    name: "Anaar Pomegranate Glass Bowl",
    collection: "kitchenware",
    subcategory: "Bowls",
    material: "Glass & gilt brass",
    tone: "brass",
    shape: "bowl",
    desc: "A clear glass bowl cradled by a gilt brass branch heavy with enamelled pomegranates.",
    story:
      "The pomegranate — anaar — is an old sign of abundance; here it is cast in brass and copper and coaxed around a hand-blown bowl.",
    tags: ["Centrepiece", "Fruit"],
    featured: true,
    image: "/media/catalog/pomegranate-branch-bowl.png",
  },
  {
    ref: "VK-02",
    slug: "pomegranate-gilt-jar-set",
    name: "Anaar Gilded Jar Trio",
    collection: "kitchenware",
    subcategory: "Bowls",
    material: "Gilded glass",
    tone: "brass",
    shape: "urn",
    desc: "A family of smoked-glass jars capped with gilded pomegranate and blossom lids.",
    story:
      "Three heights, one hand — the lids are cast, gilded and matched to each body so the set reads as a grown thing, not a stacked one.",
    tags: ["Storage", "Set"],
    image: "/media/catalog/pomegranate-gilt-jar-set.png",
  },
  {
    ref: "VK-03",
    slug: "crystal-pedestal-compote",
    name: "Solitaire Crystal Compote",
    collection: "kitchenware",
    subcategory: "Bowls",
    material: "Cut crystal",
    tone: "silver",
    shape: "bowl",
    desc: "A footed compote cut from a single block of crystal, faceted top to base.",
    story:
      "Raised on a diamond-cut stem, it lifts fruit or sweets a few bright centimetres off the table and doubles the candlelight around them.",
    tags: ["Footed", "Fruit"],
    image: "/media/catalog/crystal-pedestal-compote.png",
  },
  {
    ref: "VK-04",
    slug: "mercury-votive-set",
    name: "Noor Mercury Votive Set",
    collection: "kitchenware",
    subcategory: "Bowls",
    material: "Mercury glass",
    tone: "silver",
    shape: "box",
    desc: "A pair of textured mercury-glass votives on a pierced gold dish, boxed as a gift.",
    story:
      "The silvered glass is stippled so a single flame multiplies across it. Presented in a gold-bordered keepsake box.",
    tags: ["Votive", "Gift"],
    image: "/media/catalog/mercury-votive-set.png",
  },
  {
    ref: "VK-05",
    slug: "mirrored-keepsake-box",
    name: "Sheesh Mirrored Keepsake Box",
    collection: "kitchenware",
    subcategory: "Bowls",
    material: "Mirrored metal & crystal",
    tone: "silver",
    shape: "box",
    desc: "A round lidded box in embossed silver, its mirrored lid set with a crystal-and-gold flower knob.",
    story:
      "Made to sit on a dressing table and hold small precious things; the faceted knob is the only ornament it needs.",
    tags: ["Lidded", "Vanity"],
    image: "/media/catalog/mirrored-keepsake-box.png",
  },
  {
    ref: "VK-06",
    slug: "cheetah-dome-cake-stand",
    name: "Shikar Domed Cake Stand",
    collection: "kitchenware",
    subcategory: "Cake Stands",
    material: "Cast brass & amber glass",
    tone: "brass",
    shape: "platter",
    desc: "A footed cake stand crowned by a hammered amber-glass dome on a cast brass cheetah stem.",
    story:
      "The dome lifts to serve and settles to keep — the cheetah coiled around the stem the same beast that prowls the Shikar lamp.",
    tags: ["Domed", "Serving"],
    image: "/media/catalog/cheetah-dome-cake-stand.png",
  },
  {
    ref: "VK-07",
    slug: "panther-footed-cake-stand",
    name: "Panther Footed Cake Stand",
    collection: "kitchenware",
    subcategory: "Cake Stands",
    material: "Blackened brass & gilt",
    tone: "bronze",
    shape: "platter",
    desc: "A black hammered pedestal stand with a gilded panther draped down to the base.",
    story:
      "The dark, dimpled column throws the polished gold cat into relief — a cake stand that holds the room as well as the cake.",
    tags: ["Footed", "Serving"],
    image: "/media/catalog/panther-footed-cake-stand.png",
  },
  {
    ref: "VK-08",
    slug: "ichkan-heritage-dinner-set",
    name: "Ichkan Heritage Dinner Set",
    collection: "kitchenware",
    subcategory: "Dinner Sets",
    material: "Fine bone china",
    tone: "silver",
    shape: "platter",
    desc: "A boxed bone-china dinner service printed with Mughal courtyards, palms and a fine cobalt check.",
    story:
      "A modern miniature-painting print fired onto translucent bone china, presented in a botanical gift case for the table that entertains.",
    tags: ["Bone china", "Gift-boxed"],
    image: "/media/catalog/ichkan-heritage-dinner-set.jpg",
  },
  {
    ref: "VK-09",
    slug: "ichkan-palm-teacup-set",
    name: "Ichkan Palm Tea-Cup Set",
    collection: "kitchenware",
    subcategory: "Dinner Sets",
    material: "Fine bone china",
    tone: "silver",
    shape: "goblet",
    desc: "Six bone-china cups and saucers with a green palm motif and blue-check rim.",
    story:
      "Light enough to read the tea through, printed with a single palm so each cup feels like a small painted window.",
    tags: ["Tea", "Set of six"],
    image: "/media/catalog/ichkan-palm-teacup-set.jpg",
  },
  {
    ref: "VK-10",
    slug: "ichkan-floral-mug-set",
    name: "Ichkan Floral Mug Set",
    collection: "kitchenware",
    subcategory: "Dinner Sets",
    material: "Fine bone china",
    tone: "silver",
    shape: "goblet",
    desc: "Four floral bone-china mugs with a matching oval tray, cased as a gift.",
    story:
      "A morning-coffee set built around a serving tray, printed with the same wildflower garden that runs through the box.",
    tags: ["Coffee", "Gift-boxed"],
    image: "/media/catalog/ichkan-floral-mug-set.jpg",
  },
  {
    ref: "VK-11",
    slug: "monochrome-place-setting",
    name: "Bauhaus Monochrome Setting",
    collection: "kitchenware",
    subcategory: "Dinner Sets",
    material: "Glazed porcelain",
    tone: "silver",
    shape: "platter",
    desc: "A graphic four-piece setting — dinner plate, side plate, bowl and cup — in black line on white.",
    story:
      "Greek key, grid and lattice drawn in a single dark line: the quiet, architectural counterpoint to the painted heritage sets.",
    tags: ["Modern", "Place setting"],
    image: "/media/catalog/monochrome-place-setting.jpg",
  },
  {
    ref: "VK-12",
    slug: "two-tier-dessert-stand",
    name: "Ryks Two-Tier Dessert Stand",
    collection: "kitchenware",
    subcategory: "Dinner Sets",
    material: "Bone china & brass",
    tone: "brass",
    shape: "platter",
    desc: "A two-tier bone-china stand on a brass rod finished with a little perched bird.",
    story:
      "Geometric-bordered plates on a gilt spine, topped by a songbird finial — high tea, raised to two storeys.",
    tags: ["Tiered", "Dessert"],
    image: "/media/catalog/two-tier-dessert-stand.jpg",
  },
  {
    ref: "VK-13",
    slug: "ichkan-peacock-teacup-set",
    name: "Ichkan Peacock Tea-Cup Set",
    collection: "kitchenware",
    subcategory: "Dinner Sets",
    material: "Fine bone china",
    tone: "silver",
    shape: "goblet",
    desc: "Six bone-china cups and saucers with a striding peacock and a deep rose border.",
    story:
      "The peacock is drawn mid-step around the cup so the tail spills onto the saucer — presented in the house's botanical gift case.",
    tags: ["Tea", "Set of six"],
    image: "/media/catalog/ichkan-peacock-teacup-set.jpg",
  },
  {
    ref: "VK-14",
    slug: "ginkgo-gilt-tray",
    name: "Ginkgo Gilt Serving Tray",
    collection: "kitchenware",
    subcategory: "Trays",
    material: "Silver & gilt brass",
    tone: "silver",
    shape: "tray",
    desc: "A beaded silver tray framed by a climbing vine of gilded ginkgo leaves.",
    story:
      "The mirror-mesh base is bordered in cast gold ginkgo — every leaf chased by hand so the light runs along the veins.",
    tags: ["Serving", "Gilt"],
    image: "/media/catalog/ginkgo-gilt-tray.png",
  },
  {
    ref: "VK-15",
    slug: "molten-silver-oval-tray",
    name: "Molten Silver Oval Tray",
    collection: "kitchenware",
    subcategory: "Trays",
    material: "Hammered silver & brass",
    tone: "silver",
    shape: "tray",
    desc: "An oval tray with a rippled, molten silver surface and slim brass handles.",
    story:
      "The face is worked until it looks like a still pour of metal; the brass handles are the only straight line on it.",
    tags: ["Serving", "Oval"],
    image: "/media/catalog/molten-silver-oval-tray.png",
  },

  /* ── IV · ACCESSORIES ─────────────────────────────────────── */
  {
    ref: "VA-01",
    slug: "amber-glass-bull",
    name: "Toro Amber Glass Sculpture",
    collection: "accessories",
    material: "Hand-blown art glass",
    tone: "copper",
    shape: "urn",
    desc: "A charging bull sculpted in amber-and-clear art glass, caught mid-stride.",
    story:
      "Blown and pulled from a single gather of molten glass; the amber core sits inside a clear body like light trapped in motion.",
    tags: ["Sculpture", "Art glass"],
    featured: true,
    image: "/media/catalog/amber-glass-bull.png",
  },
  {
    ref: "VA-02",
    slug: "art-glass-fish",
    name: "Marina Art-Glass Fish",
    collection: "accessories",
    material: "Hand-blown art glass",
    tone: "copper",
    shape: "urn",
    desc: "A plump fish in white and tangerine glass with clear rippled fins.",
    story:
      "The orange swirls are folded into the body while it is still molten, so no two fish ever swim the same pattern.",
    tags: ["Sculpture", "Art glass"],
    image: "/media/catalog/art-glass-fish.png",
  },
  {
    ref: "VA-03",
    slug: "aurora-art-glass",
    name: "Aurora Art-Glass Sculpture",
    collection: "accessories",
    material: "Hand-blown art glass",
    tone: "bronze",
    shape: "vase",
    desc: "A free-formed sculpture in smoke and gold-leaf glass, curling like a wave.",
    story:
      "Gold leaf is rolled into the molten glass and stretched, scattering flecks of light through a form that is different from every angle.",
    tags: ["Sculpture", "Abstract"],
    image: "/media/catalog/aurora-art-glass.png",
  },
  {
    ref: "VA-04",
    slug: "onyx-faceted-crystal-bowl",
    name: "Onyx Faceted Crystal Bowl",
    collection: "accessories",
    material: "Smoked crystal",
    tone: "silver",
    shape: "bowl",
    desc: "An octagonal catch-all cut from smoky black crystal, every face polished sharp.",
    story:
      "Heavy in the hand and cold to the touch, it holds keys, cufflinks or nothing at all — the facets do the work.",
    tags: ["Catch-all", "Desk"],
    image: "/media/catalog/onyx-faceted-crystal-bowl.png",
  },
  {
    ref: "VA-05",
    slug: "smoke-crystal-catch-all",
    name: "Eclipse Crystal Catch-All",
    collection: "accessories",
    material: "Smoked crystal",
    tone: "silver",
    shape: "bowl",
    desc: "A square catch-all in smoked crystal with a deep circular well and stepped rim.",
    story:
      "Cut so the round well floats inside the square block — a small architecture for the things a pocket empties at day's end.",
    tags: ["Catch-all", "Desk"],
    image: "/media/catalog/smoke-crystal-catch-all.png",
  },
  {
    ref: "VA-06",
    slug: "heritage-owl-figurine",
    name: "Ulûka Painted Owl",
    collection: "accessories",
    material: "Hand-painted ceramic",
    tone: "silver",
    shape: "box",
    desc: "A round-bellied owl in indigo and white with a hand-painted feather coat.",
    story:
      "Each feather is drawn by brush over a crackle glaze, so the bird carries the faint web of age from the day it is made.",
    tags: ["Figurine", "Ceramic"],
    image: "/media/catalog/heritage-owl-figurine.png",
  },
  {
    ref: "VA-07",
    slug: "heritage-elephant-figurine",
    name: "Gaja Painted Elephant",
    collection: "accessories",
    material: "Hand-painted ceramic",
    tone: "silver",
    shape: "box",
    desc: "A ceramic elephant in white and cobalt, caparisoned with painted flowers and gold scrollwork.",
    story:
      "Modelled with the trunk curled for luck and dressed in hand-painted regalia in the old Kangra palette.",
    tags: ["Figurine", "Ceramic"],
    image: "/media/catalog/heritage-elephant-figurine.png",
  },
  {
    ref: "VA-08",
    slug: "blossom-rabbit-pair",
    name: "Blossom Rabbit Pair",
    collection: "accessories",
    material: "Hand-painted ceramic",
    tone: "silver",
    shape: "box",
    desc: "A pair of ceramic rabbits painted with indigo blossoms and dipped-blue ears.",
    story:
      "Sold as a facing pair — one sitting up, one at rest — hand-painted so their flower coats mirror without matching.",
    tags: ["Figurine", "Pair"],
    image: "/media/catalog/blossom-rabbit-pair.png",
  },
  {
    ref: "VA-09",
    slug: "fortune-cat-figurine",
    name: "Fortune Cat Figurine",
    collection: "accessories",
    material: "Hand-painted ceramic",
    tone: "silver",
    shape: "box",
    desc: "A plump white cat wearing a painted collar and a little enamelled fortune locket.",
    story:
      "A quiet charm for a shelf or a shop counter, hand-painted with blue-tipped ears and a heart pendant for luck.",
    tags: ["Figurine", "Charm"],
    image: "/media/catalog/fortune-cat-figurine.png",
  },
  {
    ref: "VA-10",
    slug: "porcelain-lotus-stem",
    name: "Kamal Porcelain Lotus Stem",
    collection: "accessories",
    material: "Porcelain & brass",
    tone: "brass",
    shape: "vase",
    desc: "A porcelain lotus and lily-pads on slender brass stems, rising from a lacquered black block.",
    story:
      "Each bloom and pad is cast in porcelain and hand-glazed, then set on brass reeds so the whole thing sways at a touch.",
    tags: ["Sculpture", "Floral"],
    image: "/media/catalog/porcelain-lotus-stem.png",
  },
  {
    ref: "VA-11",
    slug: "dragonfly-catch-all",
    name: "Dragonfly Wooden Catch-All",
    collection: "accessories",
    material: "Walnut wood & brass",
    tone: "brass",
    shape: "tray",
    desc: "A square walnut catch-all tray with a cast brass dragonfly resting on a flowering branch.",
    story:
      "The dragonfly perches on the rim as if it has just landed — a warm wooden dish for a desk, a hall, a bedside.",
    tags: ["Catch-all", "Desk"],
    image: "/media/catalog/dragonfly-catch-all.png",
  },
  {
    ref: "VA-12",
    slug: "noir-stripe-vanity-set",
    name: "Kohl Striped Vanity Set",
    collection: "accessories",
    material: "Glazed stoneware",
    tone: "bronze",
    shape: "box",
    desc: "A four-piece bath set — dispenser, tumbler, brush holder and dish — in black glaze combed with sand stripes.",
    story:
      "The stripes are scored back through the black glaze to the pale clay beneath, so each piece carries a hand-drawn grain.",
    tags: ["Bath", "Set of four"],
    image: "/media/catalog/noir-stripe-vanity-set.png",
  },
  {
    ref: "VA-13",
    slug: "ascent-bronze-figures",
    name: "Ascent Bronze Figures",
    collection: "accessories",
    material: "Cast bronze & stone",
    tone: "bronze",
    shape: "urn",
    desc: "Three slender bronze figures hauling one another up a pale stone monolith.",
    story:
      "A small sculpture about lift and trust — the figures are cast rough and dark against the smooth stone they climb.",
    tags: ["Sculpture", "Bronze"],
    image: "/media/catalog/ascent-bronze-figures.png",
  },

  /* ── V · CLOCKS ───────────────────────────────────────────── */
  {
    ref: "VC-01",
    slug: "gimbal-skeleton-clock",
    name: "Orbit Gimbal Skeleton Clock",
    collection: "clocks",
    material: "Brass & marble",
    tone: "brass",
    shape: "box",
    desc: "A skeleton movement suspended inside a brass ring on a tapered marble plinth.",
    story:
      "The exposed gears turn openly within a polished gimbal, so the clock shows its heartbeat as plainly as the hour.",
    tags: ["Desk", "Skeleton"],
    featured: true,
    image: "/media/catalog/gimbal-skeleton-clock.png",
  },
  {
    ref: "VC-02",
    slug: "arch-skeleton-desk-clock",
    name: "Meridian Arch Skeleton Clock",
    collection: "clocks",
    material: "Optical crystal & brass",
    tone: "brass",
    shape: "box",
    desc: "A gilt skeleton dial floating in a clear crystal arch with Roman numerals.",
    story:
      "The movement seems to hang in mid-air inside the polished crystal — a paperweight that happens to keep perfect time.",
    tags: ["Desk", "Crystal"],
    image: "/media/catalog/arch-skeleton-desk-clock.png",
  },

  /* ── VI · WEDDING ─────────────────────────────────────────── */
  {
    ref: "VW-01",
    slug: "mehendi-haldi-round-invite",
    name: "Mehendi Haldi Round Invitation",
    collection: "wedding",
    subcategory: "Invitations",
    material: "Foiled art board",
    tone: "brass",
    shape: "box",
    desc: "Circular ceremony cards in turquoise, saffron and magenta, foiled with Mughal gardens.",
    story:
      "A round format for the day-events — mehendi and haldi — each disc foiled in gold and stood on a little acrylic easel.",
    tags: ["Invitation", "Ceremony"],
    image: "/media/catalog/mehendi-haldi-round-invite.jpg",
  },
  {
    ref: "VW-02",
    slug: "royal-portrait-invite",
    name: "Royal Portrait Wedding Invitation",
    collection: "wedding",
    subcategory: "Invitations",
    material: "Foiled art board",
    tone: "silver",
    shape: "box",
    desc: "A cobalt invitation carrying a hand-illustrated portrait of the couple in a gilded cartouche.",
    story:
      "The couple is drawn as a miniature royal pair beneath a jharokha arch, peacocks at the border — bespoke to each name.",
    tags: ["Invitation", "Portrait"],
    image: "/media/catalog/royal-portrait-invite.jpg",
  },
  {
    ref: "VW-03",
    slug: "pichwai-kamadhenu-invite",
    name: "Pichwai Kamadhenu Invitation",
    collection: "wedding",
    subcategory: "Invitations",
    material: "Foiled art board",
    tone: "brass",
    shape: "box",
    desc: "A magenta invitation folio painted with pichwai cows, lotuses and hanging temple bells.",
    story:
      "The sacred Kamadhenu herd is rendered in the Nathdwara pichwai style and foil-stamped over a jewel-pink ground.",
    tags: ["Invitation", "Pichwai"],
    image: "/media/catalog/pichwai-kamadhenu-invite.jpg",
  },
  {
    ref: "VW-04",
    slug: "jharokha-birds-invite-mount",
    name: "Jharokha Birds Invitation Mount",
    collection: "wedding",
    subcategory: "Invitations",
    material: "Meenakari board",
    tone: "brass",
    shape: "box",
    desc: "A saffron invitation mount bordered with meenakari arches, parrots and a central marigold crest.",
    story:
      "Framed like a little palace window — jharokha — with painted birds in each niche and a gold foil centre for the names.",
    tags: ["Invitation", "Meenakari"],
    image: "/media/catalog/jharokha-birds-invite-mount.jpg",
  },
  {
    ref: "VW-05",
    slug: "pichwai-shagun-card-set",
    name: "Pichwai Shagun Card & Candle Set",
    collection: "wedding",
    subcategory: "Invitations",
    material: "Gilded board & glass",
    tone: "brass",
    shape: "box",
    desc: "A gilded pichwai frame paired with two painted candle jars and matching printed invites.",
    story:
      "An invitation that arrives as a gift — the framed card flanked by scented candle jars in the same hand-painted garden.",
    tags: ["Invitation", "Gift set"],
    image: "/media/catalog/pichwai-shagun-card-set.jpg",
  },
  {
    ref: "VW-06",
    slug: "haveli-invitation-box",
    name: "Haveli Palace Invitation Box",
    collection: "wedding",
    subcategory: "Invitation Boxes",
    material: "Gilded board & glass",
    tone: "brass",
    shape: "box",
    desc: "A gold invitation box built as a painted haveli that opens through its own carved doors.",
    story:
      "The façade is printed with jharokha windows; the doors swing open to the card and a pair of gilded canisters within.",
    tags: ["Invitation box", "Statement"],
    featured: true,
    image: "/media/catalog/haveli-invitation-box.jpg",
  },
  {
    ref: "VW-07",
    slug: "radha-krishna-invite-box",
    name: "Radha Krishna Invitation Box",
    collection: "wedding",
    subcategory: "Invitation Boxes",
    material: "Enamelled board & brass",
    tone: "brass",
    shape: "box",
    desc: "A teal-and-gold invitation box with two painted canisters and a Radha-Krishna card.",
    story:
      "Peacocks and a devotional miniature set the tone; the gold-lidded jars hold sweets or dry fruit for the first call.",
    tags: ["Invitation box", "Devotional"],
    image: "/media/catalog/radha-krishna-invite-box.jpg",
  },
  {
    ref: "VW-08",
    slug: "pichwai-trunk-hamper",
    name: "Pichwai Cow Trunk Box",
    collection: "wedding",
    subcategory: "Invitation Boxes",
    material: "Painted wood & brass",
    tone: "silver",
    shape: "box",
    desc: "A blue painted trunk of pichwai cows, opening to pearls, a potli and a lidded keepsake jar.",
    story:
      "A trousseau box for the bride's side — the lid a lotus pond of grazing cows, the interval velvet-lined for its treasures.",
    tags: ["Trunk", "Trousseau"],
    image: "/media/catalog/pichwai-trunk-hamper.jpg",
  },
  {
    ref: "VW-09",
    slug: "ganesha-shagun-box",
    name: "Ganesha Shagun Box",
    collection: "wedding",
    subcategory: "Invitation Boxes",
    material: "Painted wood & brass",
    tone: "brass",
    shape: "box",
    desc: "A saffron shagun box with a gilded canister and a bright Ganesha crest, dressed in silk flowers.",
    story:
      "Opened to bless the beginning of things — a painted casket for the token gift that travels with the invitation.",
    tags: ["Shagun", "Auspicious"],
    image: "/media/catalog/ganesha-shagun-box.jpg",
  },
  {
    ref: "VW-10",
    slug: "blush-velvet-invite-trunk",
    name: "Blush Velvet Invitation Trunk",
    collection: "wedding",
    subcategory: "Invitation Boxes",
    material: "Velvet & painted wood",
    tone: "silver",
    shape: "box",
    desc: "A blush velvet trunk holding a nested tea service, a silver bowl and the printed invitation.",
    story:
      "Painted with a field of marigolds at the base and lined in pink velvet — an invitation that doubles as the first gift.",
    tags: ["Trunk", "Trousseau"],
    image: "/media/catalog/blush-velvet-invite-trunk.jpg",
  },
  {
    ref: "VW-11",
    slug: "botanica-glass-hamper",
    name: "Botanica Glass Keepsake Hamper",
    collection: "wedding",
    subcategory: "Hampers",
    material: "Glass & brass",
    tone: "brass",
    shape: "box",
    desc: "A brass-edged glass box filled with blooms and gilded jars, tied with a jute bow.",
    story:
      "A see-through keepsake hamper — the contents are the ornament — finished with a raw-jute ribbon for a garden wedding.",
    tags: ["Hamper", "Keepsake"],
    image: "/media/catalog/botanica-glass-hamper.jpg",
  },
  {
    ref: "VW-12",
    slug: "bagh-candle-hamper",
    name: "Bagh Courtly Candle Hamper",
    collection: "wedding",
    subcategory: "Hampers",
    material: "Enamelled tin & wax",
    tone: "brass",
    shape: "box",
    desc: "A blue courtly tray set with two painted candle canisters, a glass basket and silk florals.",
    story:
      "Miniature court scenes wrap the candles; the whole tray is dressed with roses and a scented votive for the welcome table.",
    tags: ["Hamper", "Candles"],
    image: "/media/catalog/bagh-candle-hamper.jpg",
  },
  {
    ref: "VW-13",
    slug: "ganesha-blessing-hamper",
    name: "Ganesha Blessing Hamper",
    collection: "wedding",
    subcategory: "Hampers",
    material: "Porcelain & enamelled tin",
    tone: "brass",
    shape: "box",
    desc: "A tray centred on a porcelain Ganesha, flanked by painted canisters and a flower arch.",
    story:
      "The remover of obstacles rides his mouse at the centre; the canisters carry sweets for the ceremony that follows.",
    tags: ["Hamper", "Auspicious"],
    image: "/media/catalog/ganesha-blessing-hamper.jpg",
  },
  {
    ref: "VW-14",
    slug: "raas-radha-krishna-hamper",
    name: "Raas Radha Krishna Hamper",
    collection: "wedding",
    subcategory: "Hampers",
    material: "Enamelled tin & silver",
    tone: "silver",
    shape: "box",
    desc: "A gota-edged tray with two green Radha-Krishna canisters and a silver swan sweet-bowl.",
    story:
      "The raas-leela painted around the jars, a silver swan bowl between them — a hamper made to be photographed before it is opened.",
    tags: ["Hamper", "Devotional"],
    image: "/media/catalog/raas-radha-krishna-hamper.jpg",
  },
  {
    ref: "VW-15",
    slug: "carriage-ring-platter",
    name: "Cinderella Carriage Ring Platter",
    collection: "wedding",
    subcategory: "Hampers",
    material: "Gilded metal & florals",
    tone: "brass",
    shape: "box",
    desc: "A gilded carriage frame dressed in ivory blooms, cradling twin ring boxes on its seat.",
    story:
      "Made for the ring exchange — a little fairy-tale coach, tasselled and flowered, that presents both rings at once.",
    tags: ["Ring ceremony", "Statement"],
    image: "/media/catalog/carriage-ring-platter.jpg",
  },
  {
    ref: "VW-16",
    slug: "silver-dryfruit-dome-set",
    name: "Regal Silver Dry-Fruit Set",
    collection: "wedding",
    subcategory: "Silver Gifting",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "box",
    desc: "Domed silver dry-fruit caddies with a pair of tall candlesticks and a matching tray.",
    story:
      "A full gifting suite in bright silver plate — repoussé domes with crystal knobs, staged for the sweets table.",
    tags: ["Silver", "Gifting suite"],
    image: "/media/catalog/silver-dryfruit-dome-set.jpg",
  },
  {
    ref: "VW-17",
    slug: "silver-partition-domes",
    name: "Meena Silver Partition Domes",
    collection: "wedding",
    subcategory: "Silver Gifting",
    material: "Silver-plated brass & glass",
    tone: "silver",
    shape: "box",
    desc: "Footed silver servers with partitioned glass wells beneath crystal-knobbed domes.",
    story:
      "Greek-key pierced sides and a glass insert divided for four kinds of dry fruit — the lid a clear dome with a faceted finial.",
    tags: ["Silver", "Dry-fruit"],
    image: "/media/catalog/silver-partition-domes.jpg",
  },
  {
    ref: "VW-18",
    slug: "silver-fruit-basket",
    name: "Vine Silver Fruit Basket",
    collection: "wedding",
    subcategory: "Silver Gifting",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "bowl",
    desc: "A footed silver basket with a high handle, chased all over with leaves and vines.",
    story:
      "Woven in silver plate and hung with a rope-twist handle — a fruit or flower basket for the gift that is meant to be kept.",
    tags: ["Silver", "Basket"],
    image: "/media/catalog/silver-fruit-basket.jpg",
  },
  {
    ref: "VW-19",
    slug: "silver-cycle-bowl",
    name: "Bela Silver Cycle Bowl",
    collection: "wedding",
    subcategory: "Silver Gifting",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "bowl",
    desc: "A scalloped silver bowl mounted on a decorative penny-farthing cycle frame.",
    story:
      "A little novelty for the sweet or the token gift — the flowering wheels roll, the bowl lifts out to serve.",
    tags: ["Silver", "Novelty"],
    image: "/media/catalog/silver-cycle-bowl.jpg",
  },
  {
    ref: "VW-20",
    slug: "silver-rose-sweet-tray",
    name: "Gulaab Silver Sweet Tray",
    collection: "wedding",
    subcategory: "Silver Gifting",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "tray",
    desc: "An octagonal silver tray with cast rose-and-leaf handles and a hammered rim.",
    story:
      "Made to carry mithai to a guest — the roses at each handle are cast solid, the field lightly planished to hide use.",
    tags: ["Silver", "Sweets"],
    image: "/media/catalog/silver-rose-sweet-tray.jpg",
  },
  {
    ref: "VW-21",
    slug: "silver-dryfruit-caddy",
    name: "Trellis Silver Dry-Fruit Caddy",
    collection: "wedding",
    subcategory: "Silver Gifting",
    material: "Silver-plated brass",
    tone: "silver",
    shape: "bowl",
    desc: "A three-bowl silver caddy gathered under a single ornate carry-handle.",
    story:
      "Three lidded wells swing from a central pillar — one hand lifts the whole service of nuts and sweets to the table.",
    tags: ["Silver", "Dry-fruit"],
    image: "/media/catalog/silver-dryfruit-caddy.jpg",
  },
  {
    ref: "VW-22",
    slug: "regalia-frame-cup-hamper",
    name: "Regalia Frame & Cup Hamper",
    collection: "wedding",
    subcategory: "Silver Gifting",
    material: "Gilt metal & silver",
    tone: "brass",
    shape: "box",
    desc: "A croc-textured gold frame paired with silvered tea cups on a dressed gifting tray.",
    story:
      "A return-gift ensemble — a keepsake photo frame and a pair of silver-collared cups, staged on a flowered tray.",
    tags: ["Gifting suite", "Keepsake"],
    image: "/media/catalog/regalia-frame-cup-hamper.jpg",
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
