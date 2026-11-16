export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  cover: string;
  body: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "the-quiet-luxury-of-vegetable-tanned-leather",
    title: "The quiet luxury of vegetable-tanned leather",
    excerpt:
      "Why we still tan our hides the slow way — and what a year of wear does to a piece of honey-soft Italian calf.",
    category: "Craft",
    author: "Camille Rousseau",
    date: "2026-04-22",
    readingTime: "6 min read",
    cover: "/images/hero-bag.jpg",
    body: [
      "There is a reason vegetable tanning has survived for two thousand years while most of the leather goods industry has moved on. It is slow, costly, and almost entirely dependent on the weather and the patience of the tanner. It is also the only way we know to make a hide that will outlive its owner.",
      "Our tannery sits on a tributary of the Arno, just outside Florence. The pits there have held the same blend of chestnut, mimosa and oak bark for four generations. A hide takes between forty and sixty days to move through them, picking up its colour from the tannins and its softness from the gentle agitation of water and wood. There are no chromium salts, no accelerators, no shortcuts.",
      "What you carry away in a finished bag is a piece of leather that has memory. It darkens where your hand rests. It pales where the sun catches it. It develops a depth — a patina — that no factory finish can imitate. After a year, your bag is unmistakably yours. After ten, it is a small biography in calfskin.",
      "We are often asked whether vegetable-tanned leather is more delicate. The honest answer is that it is more alive. It does not want to be wiped clean and forgotten. It wants to be carried, conditioned once a season, and allowed to age. In return, it gives you a quiet, unrepeatable kind of luxury — the kind you cannot order on demand, only earn with use.",
    ],
  },
  {
    slug: "five-ways-to-style-a-tote-from-morning-to-evening",
    title: "Five ways to style a tote from morning to evening",
    excerpt:
      "A single bag, a long day, and the small adjustments that take it from the office to a late dinner in the Marais.",
    category: "Style",
    author: "Inès Laurent",
    date: "2026-04-08",
    readingTime: "4 min read",
    cover: "/images/bag-tote.jpg",
    body: [
      "The case for a single bag is also the case for a single, well-considered wardrobe. If you have spent on something properly made, you should be able to carry it from a 9 a.m. meeting to a candlelit dinner without thinking twice. Here is how we do it.",
      "Morning, by the river. Wear it on the shoulder, strap unclipped, with a tailored coat and low boots. The bag should look almost incidental — the kind of thing you have always had.",
      "Lunch, somewhere quiet. Move it to the crook of the arm. Pair with a fine knit and gold studs. Nothing else needs to change.",
      "Afternoon errands. Loop the strap once for a shorter drop. Add a silk square at the handle if the wind is sharp.",
      "Aperitif, at golden hour. Empty out the work things. Slip in a small pouch and a lipstick. The bag suddenly looks half its size.",
      "Dinner, somewhere with low light. Carry it by the top handle, vertical, like a clutch with confidence. Done.",
    ],
  },
  {
    slug: "inside-the-atelier-a-day-with-our-finishers",
    title: "Inside the atelier: a day with our finishers",
    excerpt:
      "Eight hands, one bag, and the small, almost invisible decisions that separate a good finish from a beautiful one.",
    category: "Atelier",
    author: "Théo Marchand",
    date: "2026-03-19",
    readingTime: "7 min read",
    cover: "/images/bag-shoulder.jpg",
    body: [
      "It is just past seven in the morning when the lights come on in the atelier. The first task is not stitching or cutting — it is sweeping. Anna, who has been with us for eleven years, says a clean bench is a clean stitch.",
      "By eight, the cutting tables are full. Each hide is laid out and inspected under daylight. A small scar near the shoulder of the animal might rule out a panel; a faint vein along the belly might be perfect for a lining. Nothing is hurried.",
      "Mid-morning, the bags begin to take shape. One craftsperson sees a bag from cut to final stitch — there is no assembly line. The conversation in the room is mostly about the work: a saddle stitch redone, an edge re-burnished, a piece set aside because something about it does not yet feel finished.",
      "By late afternoon, the day's bags are lined up on a long oak table. Each is turned, weighed, opened, closed. The small, almost invisible decisions of the day are now visible only as an absence — there is nothing to draw the eye away from the leather. That, we have come to believe, is the point.",
    ],
  },
  {
    slug: "caring-for-your-bag-through-the-seasons",
    title: "Caring for your bag through the seasons",
    excerpt:
      "A short, honest guide to keeping your leather looking better in its tenth year than its first.",
    category: "Care",
    author: "Camille Rousseau",
    date: "2026-02-27",
    readingTime: "5 min read",
    cover: "/images/bag-crossbody.jpg",
    body: [
      "Leather, like skin, responds to the seasons. A bag that lives in damp coats from November to March needs different attention than one that travels in a hot car all of July. The good news: you do not need a shelf of products. You need a soft cloth, a tin of conditioner, and a few minutes every few months.",
      "After winter. Wipe the bag down with a barely-damp cloth to lift salt and city dust. Let it dry away from radiators. Once dry, work a thin layer of conditioner into the leather in small circles. Buff gently with a clean cloth. The colour will deepen by half a shade.",
      "Through summer. Keep your bag out of direct, prolonged sun — it dries the natural oils. If it gets caught in rain, blot it (do not rub) and let it dry slowly at room temperature. Stuff it lightly with a clean cotton scarf to hold its shape.",
      "When you store it. Empty the bag, fill it loosely with tissue or cloth, and slip it into its dust bag. Avoid plastic — leather needs to breathe. A cool, dark drawer is better than a sunny shelf.",
      "Done a few times a year, this is enough. We have customers carrying bags they bought from us a decade ago that look better now than the day they were made.",
    ],
  },
  {
    slug: "the-case-for-fewer-bags",
    title: "The case for fewer bags",
    excerpt:
      "On owning three bags instead of thirty — and why our most loyal customers tend to buy from us less, not more.",
    category: "Maison",
    author: "Léa Fontaine",
    date: "2026-01-30",
    readingTime: "3 min read",
    cover: "/images/bag-clutch.jpg",
    body: [
      "We are a small house, and we make small numbers of bags. That is partly a constraint — there are only so many hours in a day at the atelier — and partly a position. We do not believe most people need more than three bags.",
      "A tote for the everyday. A crossbody for the weekend. A clutch for the evenings that matter. Done well, those three pieces will see you through almost every situation a life can hand you. They will also age into something that no new bag can be: yours.",
      "Our most loyal customers tend to buy from us once every few years. They write to us about a strap that has softened, a corner that has lightened, a small repair we have done in the atelier and returned to them in tissue paper. That, more than any growth chart, is the metric we care about.",
    ],
  },
  {
    slug: "what-we-mean-when-we-say-made-in-italy",
    title: "What we mean when we say \"Made in Italy\"",
    excerpt:
      "The phrase has become almost meaningless. Here is the version we hold ourselves to — and how to tell the difference.",
    category: "Maison",
    author: "Théo Marchand",
    date: "2026-01-12",
    readingTime: "5 min read",
    cover: "/images/bag-bucket.jpg",
    body: [
      "\"Made in Italy\" is a label, not a guarantee. Under European law, a bag can carry it as long as the last \"substantial transformation\" happened on Italian soil. In practice, that means hides cut in one country, panels stitched in another, and a final lining sewn in a workshop near Naples — three flags, one tag.",
      "We hold ourselves to a stricter standard, partly out of stubbornness and partly because we think it matters. Our hides are tanned in Tuscany. Our hardware is cast and plated in Lombardy. Every panel is cut, stitched, edged and finished in the same atelier outside Florence, by the same small team. There is no offshoring of any step.",
      "If you are buying leather goods in 2026 and the provenance matters to you, the question to ask is not \"where was this made?\" but \"how many hands and how many countries did it pass through to get here?\" The answer will tell you almost everything.",
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const sameCategory = posts.filter(
    (p) => p.slug !== slug && p.category === current.category,
  );
  const others = posts.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
