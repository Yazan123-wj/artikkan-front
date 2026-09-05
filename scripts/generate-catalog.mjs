import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = process.cwd();
const srcRoot = '/Users/yazan/Desktop/artikkan/categories';
const productsDir = join(root, 'public/images/catalog/products');

const CATEGORY_MAP = {
  Tables: 'tables',
  Seating: 'seating',
  'Unit Cabinets': 'unit-cabinets',
  Accessories: 'accessories',
  'Home Decor': 'home-decor',
};

const SUB_LABEL = {
  'Console Tables': 'console-table',
  'Center Tables': 'center-table',
  'Dining Tables': 'dining-table',
  'Side Tables': 'side-table',
  Sofas: 'sofa',
  Poufs: 'pouf',
  Chairs: 'chair',
  Benches: 'bench',
  Mobkhars: 'mobkhar',
  Coasters: 'coasters',
  'Candle Holders': 'candle-holder',
  'Tissue Boxes': 'tissue-box',
  Containers: 'container',
  'Napkin Holders': 'napkin-holder',
  'Display Shelves': 'display-shelf',
  'Art Work': 'artwork',
  Mirrors: 'mirror',
  'Photo Frames': 'photo-frame',
  'Book Stands': 'book-stand',
  'Planter Boxes': 'planter',
  'Serving Trays': 'serving-tray',
  'Mobile Phone Holders': 'phone-holder',
};

const NAME_EN = {
  'console-table': 'Console Table',
  'center-table': 'Center Table',
  'dining-table': 'Dining Table',
  'side-table': 'Side Table',
  sofa: 'Sofa',
  pouf: 'Pouf',
  chair: 'Chair',
  bench: 'Bench',
  mobkhar: 'Mobkhar',
  coasters: 'Coasters',
  'candle-holder': 'Candle Holder',
  'tissue-box': 'Tissue Box',
  container: 'Container',
  'napkin-holder': 'Napkin Holder',
  'display-shelf': 'Display Shelf',
  artwork: 'Artwork',
  mirror: 'Mirror',
  'photo-frame': 'Photo Frame',
  'book-stand': 'Book Stand',
  planter: 'Planter',
  'serving-tray': 'Serving Tray',
  'phone-holder': 'Phone Holder',
  'unit-cabinet': 'Unit Cabinet',
};

const NAME_AR = {
  'console-table': 'طاولة كونسول',
  'center-table': 'طاولة وسط',
  'dining-table': 'طاولة طعام',
  'side-table': 'طاولة جانبية',
  sofa: 'أريكة',
  pouf: 'بوف',
  chair: 'كرسي',
  bench: 'مقعد',
  mobkhar: 'مبخر',
  coasters: 'قواعد أكواب',
  'candle-holder': 'حامل شموع',
  'tissue-box': 'علبة مناديل',
  container: 'حاوية',
  'napkin-holder': 'حامل مناديل',
  'display-shelf': 'رف عرض',
  artwork: 'عمل فني',
  mirror: 'مرآة',
  'photo-frame': 'إطار صورة',
  'book-stand': 'حامل كتب',
  planter: 'حوض نباتات',
  'serving-tray': 'صينية تقديم',
  'phone-holder': 'حامل هاتف',
  'unit-cabinet': 'خزانة وحدة',
};

const FINISH = {
  WP: ['Walnut Polished', 'جوز ملمع'],
  WV: ['Walnut Veneer', 'قشرة جوز'],
};

const DESC_EN = {
  sofa: 'A composed seating piece with generous presence and quiet materials.',
  chair: 'A considered chair for dining or conversation, shaped for lasting comfort.',
  bench: 'A linear bench for entry, corridor or gathering spaces.',
  pouf: 'A compact seat that softens a room and invites informal rest.',
  'dining-table': 'A dining table for lingering meals and measured conversation.',
  'center-table': 'A center table that anchors seating with calm proportion.',
  'console-table': 'A console for hallways and living rooms — refined and purposeful.',
  'side-table': 'A side table for light, books and the small rituals of a room.',
  'unit-cabinet': 'A storage unit with architectural clarity and careful craft.',
  'display-shelf': 'A display shelf for objects that deserve quiet attention.',
  mirror: 'A mirror that expands light and finishes a wall with restraint.',
  artwork: 'A wall piece that brings texture and quiet graphic presence.',
  'photo-frame': 'A frame for photographs and keepsakes, made to last.',
  'book-stand': 'A book stand for reading and display.',
  planter: 'A planter box that brings greenery into the room with care.',
  'serving-tray': 'A serving tray for hospitality and everyday ceremony.',
  'phone-holder': 'A phone holder that keeps the tabletop ordered.',
  mobkhar: 'A mobkhar for incense — crafted for hospitality and ritual.',
  coasters: 'Coasters that protect surfaces with refined detail.',
  'candle-holder': 'A candle holder for evening light and soft atmosphere.',
  'tissue-box': 'A tissue box cover that keeps the tabletop composed.',
  container: 'A container for small essentials, made with precision.',
  'napkin-holder': 'A napkin holder for the dining table.',
};

const DESC_AR = {
  sofa: 'قطعة جلوس متماسكة بحضور رحّب ومواد هادئة.',
  chair: 'كرسي مدروس للطعام أو الحوار، مصمَّم لراحة تدوم.',
  bench: 'مقعد خطي للمدخل أو الممر أو مساحات اللقاء.',
  pouf: 'مقعد صغير يهدّئ الغرفة ويدعو إلى استراحة غير متكلّفة.',
  'dining-table': 'طاولة طعام لإطالة الجلوس والحوار الهادئ.',
  'center-table': 'طاولة وسط ترسّخ الجلسة بنِسب هادئة.',
  'console-table': 'كونسول للممرات وغرف المعيشة — رفيع ووظيفي.',
  'side-table': 'طاولة جانبية للضوء والكتب وتفاصيل اليوم الصغيرة.',
  'unit-cabinet': 'وحدة تخزين بوضوح معماري وحرفة دقيقة.',
  'display-shelf': 'رف عرض للقطع التي تستحق انتباهاً هادئاً.',
  mirror: 'مرآة توسّع الضوء وتكمل الجدار برصانة.',
  artwork: 'عمل جداري يمنح ملمساً وحضوراً بصرياً هادئاً.',
  'photo-frame': 'إطار للصور والذكريات، مصنوع ليدوم.',
  'book-stand': 'حامل كتب للقراءة والعرض.',
  planter: 'حوض نباتات يُدخل الخضرة إلى الغرفة بعناية.',
  'serving-tray': 'صينية تقديم للضيافة ومراسم اليوم.',
  'phone-holder': 'حامل هاتف يُبقي سطح الطاولة منظّماً.',
  mobkhar: 'مبخر للبخور — مصنوع للضيافة والطقس.',
  coasters: 'قواعد أكواب تحمي الأسطح بتفاصيل رفيعة.',
  'candle-holder': 'حامل شموع لضوء المساء وأجواء هادئة.',
  'tissue-box': 'غطاء علبة مناديل يُبقي سطح الطاولة متماسكاً.',
  container: 'حاوية للمستلزمات الصغيرة، مصنوعة بدقّة.',
  'napkin-holder': 'حامل مناديل لمائدة الطعام.',
};

const MATERIALS = {
  seating: [
    'Solid wood, veneer and carefully finished upholstery',
    'خشب صلب وقشرة وتنجيد بتشطيب دقيق',
  ],
  tables: [
    'Solid wood and veneer with carefully finished surfaces',
    'خشب صلب وقشرة بأسطح بتشطيب دقيق',
  ],
  'unit-cabinets': [
    'Solid wood, veneer and refined hardware',
    'خشب صلب وقشرة وتفاصيل معدنية رفيعة',
  ],
  'home-decor': [
    'Wood, glass and considered surface treatments',
    'خشب وزجاج ومعالجات سطح مدروسة',
  ],
  accessories: [
    'Wood and metal with refined finishing',
    'خشب ومعدن بتشطيب رفيع',
  ],
};

const FEATURED = [
  'artk-sof-01',
  'artk-dt-01',
  'artk-cot-02',
  'artk-un-01',
  'artk-ch-01-wv',
  'artk-ben-01',
  'artk-ct-01',
  'artk-shf-01',
];

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function dims(path) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', path], {
    encoding: 'utf8',
  });
  const w = Number(out.match(/pixelWidth:\s*(\d+)/)[1]);
  const h = Number(out.match(/pixelHeight:\s*(\d+)/)[1]);
  return [w, h];
}

const products = [];
const seen = new Set();

for (const file of walk(srcRoot).sort()) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
  const rel = file.slice(srcRoot.length + 1);
  const parts = rel.split('/');
  if (parts.length === 1) continue;

  const top = parts[0];
  if (!CATEGORY_MAP[top]) continue;
  const category = CATEGORY_MAP[top];

  let sub;
  let stem;
  if (category === 'unit-cabinets') {
    sub = 'unit-cabinet';
    stem = basename(file).replace(/\.[^.]+$/, '');
  } else if (parts.length >= 3) {
    sub = SUB_LABEL[parts[1]];
    if (!sub) continue;
    stem = basename(file).replace(/\.[^.]+$/, '');
  } else {
    continue;
  }

  let raw = stem.trim();
  if (sub === 'napkin-holder' && raw.includes('Candle')) raw = 'Napkin Holder';

  let finishCode = null;
  let reference = null;
  let number = null;
  let slug;

  if (/ARTK/i.test(raw)) {
    let code = raw.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
    const fin = code.match(/-(WP|WV)$/);
    if (fin) {
      finishCode = fin[1];
      code = code.slice(0, fin.index);
    }
    slug = code.toLowerCase();
    if (finishCode) slug = `${slug}-${finishCode.toLowerCase()}`;
    reference = code;
    const num = code.match(/(\d+[A-Z]?)$/);
    if (num) number = num[1];
  } else {
    slug = sub;
  }

  let unique = slug;
  let i = 2;
  while (seen.has(unique)) {
    unique = `${slug}-${i}`;
    i += 1;
  }
  seen.add(unique);
  slug = unique;

  const out = join(productsDir, `${slug}.jpg`);
  if (!existsSync(out)) continue;
  const [width, height] = dims(out);

  let nameEn = NAME_EN[sub];
  let nameAr = NAME_AR[sub];
  if (number) {
    nameEn = `${nameEn} ${number}`;
    nameAr = `${nameAr} ${number}`;
  }
  if (finishCode && FINISH[finishCode]) {
    nameEn = `${nameEn} · ${FINISH[finishCode][0]}`;
    nameAr = `${nameAr} · ${FINISH[finishCode][1]}`;
  }

  const [matEn, matAr] = MATERIALS[category];
  const [finEn, finAr] = finishCode && FINISH[finishCode]
    ? FINISH[finishCode]
    : ['Natural wood finishes', 'تشطيبات خشب طبيعي'];

  products.push({
    id: slug,
    slug,
    nameKey: slug,
    categoryKey: category,
    sub,
    reference,
    nameEn,
    nameAr,
    altEn: `Artikkan ${nameEn}`,
    altAr: `أرتيكان — ${nameAr}`,
    descEn: DESC_EN[sub] || 'A carefully crafted Artikkan piece.',
    descAr: DESC_AR[sub] || 'قطعة أرتيكان مصنوعة بعناية.',
    materialsEn: matEn,
    materialsAr: matAr,
    dimensionsEn: 'Custom sizing available on request',
    dimensionsAr: 'الأبعاد قابلة للتخصيص عند الطلب',
    finishesEn: finEn,
    finishesAr: finAr,
    src: `/images/catalog/products/${slug}.jpg`,
    width,
    height,
  });
}

const featured = FEATURED.map((id) => products.find((p) => p.id === id)).filter(Boolean);
const rest = products.filter((p) => !FEATURED.includes(p.id));

function productTs(p) {
  const ref = p.reference ? `\n    reference: '${p.reference}',` : '';
  return `  {
    id: '${p.id}',
    slug: '${p.slug}',
    nameKey: '${p.nameKey}',
    categoryKey: '${p.categoryKey}',
    subKey: '${p.sub}',${ref}
    image: {
      src: '${p.src}',
      width: ${p.width},
      height: ${p.height},
      fit: 'contain',
      objectPosition: 'center center',
    },
  }`;
}

const productsTs = `import type { FeaturedProduct } from '@/types/product';

/**
 * Artikkan catalogue — sourced from client product photography.
 * Homepage featured grid uses \`featuredProducts\`; full browse uses \`catalogProducts\`.
 */
export const featuredProducts = [
${featured.map(productTs).join(',\n')},
] as const satisfies readonly FeaturedProduct[];

export const additionalCatalogProducts = [
${rest.map(productTs).join(',\n')},
] as const satisfies readonly FeaturedProduct[];

export const catalogProducts = [
  ...featuredProducts,
  ...additionalCatalogProducts,
] as const;

export function getFeaturedProductById(
  id: string,
): FeaturedProduct | undefined {
  return featuredProducts.find((product) => product.id === id);
}

export function getCatalogProductById(
  id: string,
): FeaturedProduct | undefined {
  return catalogProducts.find((product) => product.id === id);
}
`;

writeFileSync(join(root, 'src/config/products.ts'), productsTs);

const details = Object.fromEntries(
  products.map((p) => [
    p.id,
    {
      description: { en: p.descEn, ar: p.descAr },
      materials: { en: p.materialsEn, ar: p.materialsAr },
      dimensions: { en: p.dimensionsEn, ar: p.dimensionsAr },
      finishes: { en: p.finishesEn, ar: p.finishesAr },
    },
  ]),
);

writeFileSync(
  join(root, 'src/config/product-details.ts'),
  `import type { LocalizedString } from '@/types/common';

export type ProductDetails = {
  description: LocalizedString;
  materials: LocalizedString;
  dimensions: LocalizedString;
  finishes: LocalizedString;
};

export const productDetails: Record<string, ProductDetails> = ${JSON.stringify(details, null, 2)};
`,
);

writeFileSync(
  join(root, 'tmp-catalog-inventory.json'),
  JSON.stringify({ products, featuredIds: FEATURED }, null, 2),
);

console.log(`Generated ${products.length} products (${featured.length} featured)`);
