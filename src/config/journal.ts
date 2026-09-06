import type { JournalArticle, JournalBlock } from '@/types/journal';
import type { LocalizedString } from '@/types/common';

function paragraph(en: string, ar: string): JournalBlock {
  return { type: 'paragraph', parts: [{ text: { en, ar } }] };
}

function heading(en: string, ar: string, level: 2 | 3 = 2): JournalBlock {
  return { type: 'heading', level, text: { en, ar } };
}

function list(items: readonly LocalizedString[]): JournalBlock {
  return { type: 'list', items };
}

/**
 * Journal entries — polished demo editorial for client review.
 * Imagery uses live catalogue product photography.
 */
export const journalArticles: readonly JournalArticle[] = [
  {
    id: 'light-and-proportion',
    slug: { en: 'light-and-proportion', ar: 'الضوء-والتناسب' },
    title: { en: 'Light and proportion', ar: 'الضوء والتناسب' },
    excerpt: {
      en: 'How daylight, scale and quiet materials give a room its character.',
      ar: 'كيف يمنح الضوء والنِسب والمواد الهادئة الغرفة طابعها.',
    },
    intro: {
      en: 'A room is remembered less for its objects than for the way light meets them. Proportion, shadow and material do the lasting work.',
      ar: 'تُحفظ الغرفة في الذاكرة بأقلّ مما فيها من أشياء، وبأكثر مما يفعله الضوء حين يلتقي بها. النِسب والظلّ والخامة هي ما يبقى.',
    },
    categoryId: 'design',
    status: 'published',
    featured: true,
    publishedAt: '2025-11-12T09:00:00.000Z',
    image: {
      src: '/images/home/artikkan-about.jpg',
      width: 767,
      height: 1024,
      objectPosition: 'center 55%',
    },
    imageAlt: {
      en: 'Artikkan lounge seating in warm daylight',
      ar: 'جلسة أرتيكان في ضوء نهاري دافئ',
    },
    blocks: [
      heading('A slower reading of the room', 'قراءة أهدأ للغرفة'),
      paragraph(
        'Furniture should settle into architecture rather than compete with it. When a chair, a table or a console is placed with care, the room feels inevitable — as if it could not have been arranged any other way.',
        'ينبغي للأثاث أن يستقرّ في العمارة لا أن ينافسها. عندما تُوضع كرسي أو طاولة أو كونسول بعناية، تبدو الغرفة حتمية — كأنّها لا تحتمل ترتيباً آخر.',
      ),
      paragraph(
        'At Artikkan, we compose seating and surfaces so daylight can travel. Soft edges catch the morning; taller forms hold the afternoon shadow. The result is a room that feels calm without emptiness.',
        'في أرتيكان نؤلّف الجلوس والأسطح بحيث يمرّ ضوء النهار. الحواف اللينة تلتقط الصباح؛ والأشكال الأطول تحتفظ بظلّ العصر. النتيجة غرفة هادئة دون فراغ.',
      ),
      list([
        { en: 'Let daylight reach the principal seating.', ar: 'دع ضوء النهار يصل إلى مجلس الجلوس الرئيسي.' },
        { en: 'Keep circulation generous and unforced.', ar: 'أبقِ حركة التنقّل رحبة وغير متكلّفة.' },
        { en: 'Choose fewer pieces, each with presence.', ar: 'اختر قطعاً أقل، لكلّ منها حضور.' },
      ]),
    ],
  },
  {
    id: 'materials-that-age',
    slug: { en: 'materials-that-age', ar: 'مواد-تتقدّم-بجمال' },
    title: { en: 'Materials that age well', ar: 'مواد تتقدّم بجمال' },
    excerpt: {
      en: 'Wood, stone and textile as they change — and why that change is the point.',
      ar: 'الخشب والحجر والنسيج كما تتغيّر — ولماذا هذا التغيّر هو المقصد.',
    },
    intro: {
      en: 'The most considered interiors are not frozen at installation. They deepen as timber darkens, linen softens and stone takes on a quiet polish.',
      ar: 'أدقّ المساحات ليست تلك التي تتجمّد لحظة التسليم. تتعمّق حين يغمق الخشب وينعم الكتّان ويكتسب الحجر صقلاً هادئاً.',
    },
    categoryId: 'materials',
    status: 'published',
    publishedAt: '2025-10-03T09:00:00.000Z',
    image: {
      src: '/images/home/categories/dining.jpg',
      width: 1536,
      height: 1024,
      objectPosition: 'center 52%',
    },
    imageAlt: {
      en: 'Artikkan dining table in natural timber',
      ar: 'طاولة طعام من أرتيكان بخشب طبيعي',
    },
    blocks: [
      heading('Patina as intention', 'الأثر بوصفه قصداً'),
      paragraph(
        'A surface that never marks can feel distant. Crafted materials invite the life of the house: a hand on a table edge, afternoon sun across a seat.',
        'السطح الذي لا يترك أثراً قد يبدو بعيداً. المواد المصنوعة بإتقان تدعو حياة البيت: يد على حافة طاولة، وشمس العصر عبر مقعد.',
      ),
      paragraph(
        'We select finishes that accept time gracefully — open-pore timber, brushed metal, textiles with depth. Wear becomes character, not regret.',
        'نختار تشطيبات تقبل الزمن برقة — خشب مفتوح المسام، معدن ممسوح، أنسجة ذات عمق. يصبح الاستخدام طابعاً لا أسفاً.',
      ),
    ],
  },
  {
    id: 'the-work-of-the-hand',
    slug: { en: 'the-work-of-the-hand', ar: 'عمل-اليد' },
    title: { en: 'The work of the hand', ar: 'عمل اليد' },
    excerpt: {
      en: 'Joints, edges and finishes that reveal how a piece was made.',
      ar: 'الوصلات والحوافّ والتشطيبات التي تكشف كيف صُنعت القطعة.',
    },
    intro: {
      en: 'Craft is most eloquent where it is almost invisible: a tight joint, a softened edge, a finish that invites touch without announcing itself.',
      ar: 'تبلغ الحرفية أبلغها حيث تكاد تختفي: وصلة محكمة، حافة ليّنة، تشطيب يدعو اللمس دون أن يعلن عن نفسه.',
    },
    categoryId: 'craft',
    status: 'published',
    publishedAt: '2025-08-21T09:00:00.000Z',
    image: {
      src: '/images/catalog/products/artk-ch-01-wv.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    imageAlt: {
      en: 'Artikkan chair showing joinery and grain',
      ar: 'كرسي أرتيكان يُظهر الوصلات والتعرّق',
    },
    blocks: [
      heading('Close looking', 'نظر عن قرب'),
      paragraph(
        'Stand close to a well-made piece and the story is in the details. Grain aligned with the form. Hardware set flush. Nothing hurried.',
        'اقترب من قطعة متقنة، تجد الحكاية في التفاصيل. تعرّق يوازي الشكل. معدن غائر في مستواه. لا شيء متعجّل.',
      ),
      paragraph(
        'Each Artikkan piece is finished by hand so that the edge feels inevitable under the palm. That quiet certainty is what clients recognise in a room.',
        'تُنهى كل قطعة من أرتيكان يدوياً حتى تشعر الحافة بالحتمية تحت راحة اليد. ذلك اليقين الهادئ هو ما يميّزه العملاء في الغرفة.',
      ),
    ],
  },
  {
    id: 'rooms-for-gathering',
    slug: { en: 'rooms-for-gathering', ar: 'غرف-للقاء' },
    title: { en: 'Rooms for gathering', ar: 'غرف للّقاء' },
    excerpt: {
      en: 'Dining and sitting spaces arranged for conversation that can last.',
      ar: 'مساحات الطعام والجلوس مرتّبة لحديث يطول.',
    },
    intro: {
      en: 'A table is not only for serving. It holds the tempo of an evening — the distance between people, the height of a glass, the pause after a meal.',
      ar: 'المائدة ليست للتقديم وحده. هي تضبط إيقاع المساء — المسافة بين الجالسين، ارتفاع الكأس، السكون بعد الطعام.',
    },
    categoryId: 'design',
    status: 'published',
    publishedAt: '2025-06-14T09:00:00.000Z',
    image: {
      src: '/images/catalog/products/artk-sof-03.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    imageAlt: {
      en: 'Artikkan seating arranged for gathering',
      ar: 'جلسة أرتيكان مرتّبة للّقاء',
    },
    blocks: [
      heading('Distance and ease', 'المسافة واليسر'),
      paragraph(
        'Seating that is slightly generous makes a gathering feel unforced. Leave room to move a chair, to arrive late, to stay.',
        'الجلسة الأرحب قليلاً تجعل اللقاء غير متكلّف. اترك متّسعاً لتحريك كرسي، وللوصول متأخراً، وللبقاء.',
      ),
      {
        type: 'figure',
        image: {
          src: '/images/catalog/products/artk-sof-04.jpg',
          width: 300,
          height: 217,
          objectPosition: 'center center',
        },
        alt: {
          en: 'Artikkan dining table for shared meals',
          ar: 'طاولة طعام من أرتيكان للوجبات المشتركة',
        },
        caption: {
          en: 'A long table holds the tempo of an evening.',
          ar: 'طاولة طويلة تضبط إيقاع المساء.',
        },
      },
    ],
  },
  {
    id: 'care-of-wood',
    slug: { en: 'care-of-wood', ar: 'العناية-بالخشب' },
    title: { en: 'A note on caring for wood', ar: 'ملاحظة في العناية بالخشب' },
    excerpt: {
      en: 'Simple habits that keep timber calm, without treating furniture as a product to maintain.',
      ar: 'عادات بسيطة تُبقي الخشب هادئاً، دون أن يُعامل الأثاث كمنتج للصيانة.',
    },
    intro: {
      en: 'Wood asks for little: shade from harsh midday sun, a dry cloth, and the patience to let a finish live.',
      ar: 'لا يطلب الخشب كثيراً: ظلاً من شمس الظهيرة القاسية، وقماشاً جافاً، وصبراً على تشطيب يعيش.',
    },
    categoryId: 'materials',
    status: 'published',
    publishedAt: '2025-04-02T09:00:00.000Z',
    image: {
      src: '/images/catalog/products/artk-ben-03.jpg',
      width: 300,
      height: 217,
      objectPosition: 'center center',
    },
    imageAlt: {
      en: 'Artikkan cabinet in natural wood finish',
      ar: 'خزانة أرتيكان بتشطيب خشب طبيعي',
    },
    blocks: [
      heading('Daily quiet care', 'عناية يومية هادئة'),
      paragraph(
        'Avoid standing water and aggressive cleaners. Dust with the grain. If a mark appears, it is often part of the piece’s life, not a fault to erase at once.',
        'تجنّب الماء الراكد والمنظّفات القاسية. امسح الغبار مع اتجاه التعرق. وإن ظهر أثر، فهو غالباً من حياة القطعة لا عيباً يُمحى على عجل.',
      ),
      paragraph(
        'For deeper care, our team can advise on oils and finishes suited to each timber. A calm routine keeps a piece present for decades.',
        'للعناية الأعمق، يمكن لفريقنا إرشادك إلى الزيوت والتشطيبات المناسبة لكل نوع خشب. روتين هادئ يبقي القطعة حاضرة لعقود.',
      ),
      {
        type: 'paragraph',
        parts: [
          {
            text: {
              en: 'Explore more perspectives in ',
              ar: 'اطّلع على مزيد من الرؤى في ',
            },
          },
          {
            text: { en: 'the journal', ar: 'المجلّة' },
            href: '/journal',
          },
          { text: { en: '.', ar: '.' } },
        ],
      },
    ],
  },
];
