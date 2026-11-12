// All editable copy and media. Swap any image URL for your own (keep roughly the same shape).
// Components read only from here, so a CMS can replace this file field by field.

const u = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`;

export const site = {
  name: "Explore China BD",
  wordmark: "EXPLORE CHINA",
  phone: "+880 1700 000 000",
  whatsapp: "https://wa.me/8801700000000",
  email: "hello@explorechinabd.com",
  address: "Gulshan Avenue, Dhaka, Bangladesh",
  year: 2026,

  preloader: ["A path to", "study", "work", "life in China."],

  corners: {
    meet: { label: "Let's talk 👋", href: "#contact" },
    social: { label: "WhatsApp", href: "https://wa.me/8801700000000" },
    hint: { label: "Free consultation", href: "#contact" },
  },

  menu: {
    items: [
      { label: "Manifesto", href: "#top" },
      { label: "Services", href: "#services" },
      { label: "Life", href: "#life" },
      { label: "Universities", href: "#universities" },
      { label: "Steps", href: "#steps" },
      { label: "FAQ", href: "#faq" },
    ],
    actions: [
      { label: "Call us", href: "tel:+8801700000000" },
      { label: "WhatsApp", href: "https://wa.me/8801700000000" },
      { label: "Email us", href: "mailto:hello@explorechinabd.com" },
    ],
  },

  hero: {
    tagline: ["Your dream,", "your visa,", "our guidance."],
    steps: [
      { label: "Dream", image: u("1508804185872-d7badad00f7d", 2000) },
      { label: "Visa", image: u("1569154941061-e231b4725ef1", 2000) },
      { label: "Guidance", image: u("1522202176988-66273c2fd55f", 2000) },
    ],
  },

  intro: {
    title: ["Every future", "begins with", "one step."],
    portrait: u("1543269865-cbf427effbad", 700),
    label: "A different way to go abroad",
    text: "We don't send applications. We open doors. The life you build in China begins with the way you prepare for it. Honest advice. Clear paperwork. Someone who answers.",
  },

  // Full-bleed film panel: our students' own stories (link the card to your testimonial videos).
  film: {
    image: u("1545893835-abaa50cbe628", 2400),
    video: "", // optional muted loop, e.g. a student's clip: "/stories.mp4"
    thumb: u("1522202176988-66273c2fd55f", 500),
    label: "Student stories",
    cta: ["Student", "stories"],
    href: "https://youtube.com", // your YouTube / Facebook testimonials
    caption: "Real students. Real visas. In their own words.",
  },


  services: [
    { title: "University admission", text: ["The right programme, not the first one.", "We read your grades, your budget and your goals, then shortlist the universities where you will actually thrive."], image: u("1606761568499-6d2451b23c66"), course: { label: "Free profile review", name: "Programmes" } },
    { title: "Scholarships", text: ["CSC, provincial, university.", "We know which door is open, and when. Most scholarships close by April. We start with you in winter."], image: u("1541339907198-e08756dedf3f"), course: { label: "Scholarship check", name: "CSC & more" } },
    { title: "Student visa", text: ["X1 or X2, filed right the first time.", "Your JW201 or JW202, admission letter and health form, prepared line by line before the embassy sees them."], image: u("1530521954074-e64f6810b32d"), course: { label: "Visa file review", name: "X1 / X2" } },
    { title: "Work visa", text: ["Your career, aligned from day one.", "Z visa and work permit, coordinated with your employer so nothing waits on a missing stamp."], image: u("1507679799987-c73779587ccf"), course: { label: "Employer guidance", name: "Z visa" } },
    { title: "Business visa", text: ["The fair, the factory, the deal.", "M visa invitations and timelines for trade-fair season and every trip that matters."], image: u("1521737604893-d14cc237f11d"), course: { label: "Trip planning", name: "M visa" } },
    { title: "Family & tourist", text: ["Bring the people you love.", "Q and S visas for family, L visas for travel. One team handles every passport in the household."], image: u("1511895426328-dc8714191300"), course: { label: "Family visas", name: "Q · S · L" } },
    { title: "Arrival", text: ["You land, and someone is waiting.", "Briefing before you fly, pickup when you arrive, residence permit within thirty days."], image: u("1436491865332-7a61a109cc05"), course: { label: "Pre-departure", name: "Briefing" } },
  ],

  gallery: {
    left: "Study",
    caption: "Life takes many forms",
    right: "Live",
    items: [
      { name: "Old gates, new friends", image: u("1529921879218-f99546d03a9d", 900) },
      { name: "Lecture day", image: u("1606761568499-6d2451b23c66", 900) },
      { name: "Green hills, long weekends", image: u("1537531383496-f4749b8032cf", 900) },
      { name: "Shanghai after class", image: u("1474181487882-5abf3f0ba6c2", 2000) },
      { name: "The Forbidden City", image: u("1547981609-4b6bfe67ca0b", 900) },
      { name: "Weekend on the coast", image: u("1529156069898-49953e39b3ac", 900) },
      { name: "The Wall in autumn", image: u("1508804185872-d7badad00f7d", 900) },
    ],
  },

  invitation: {
    label: "An invitation to begin",
    text: "Your path starts where you are. There is no single way to China. We help you find the programme, the city and the scholarship that fit who you are, what you need, and where you want to go.",
    cta: { label: "Explore universities", href: "#universities" },
  },

  bleed: { image: u("1547981609-4b6bfe67ca0b", 2400), label: "Where you could be next September", statement: ["Every city", "is a classroom."] },

  // "Who we are": statement + intro (left), a photo opening inside a big ring (middle), what we handle (right).
  poem: {
    label: "Who we are",
    title: ["We open doors", "for students,", "families", "and dreamers."],
    accent: "doors",
    text: "Explore China BD is a small team in Dhaka that stays with you from the first conversation to your first semester: the right programme, the scholarship, the visa, and the landing.",
    cta: { label: "About us", href: "#contact" },
    image: u("1529156069898-49953e39b3ac", 1400), // replace with your team or your students in China
    caption: "Life after the visa",
    pillarsLabel: "What we handle",
    pillars: [
      { label: "Study", text: "Admissions & scholarships" },
      { label: "Work", text: "Z visas & work permits" },
      { label: "Live", text: "Family visas & arrival" },
    ],
  },


  universities: {
    title: "Universities",
    intro: "Where our students study. Placeholder figures: confirm each intake and fee before publishing.",
    items: [
      { name: "Tsinghua University", city: "Beijing", level: "Bachelor · Master · PhD", intake: "September", fee: "CSC eligible", image: u("1703957606218-119eeaef75e7", 800) },
      { name: "Peking University", city: "Beijing", level: "Master · PhD", intake: "September", fee: "CSC eligible", image: u("1691758070204-d684a5187d81", 800) },
      { name: "Fudan University", city: "Shanghai", level: "Bachelor · Master", intake: "September", fee: "From ¥26,000 / yr", image: u("1715905422238-193dd076cb50", 800) },
      { name: "Shanghai Jiao Tong", city: "Shanghai", level: "Bachelor · Master · PhD", intake: "September", fee: "Partial scholarship", image: u("1448584109583-8f5fe2e61544", 800) },
      { name: "Zhejiang University", city: "Hangzhou", level: "Bachelor · Master", intake: "September", fee: "From ¥24,000 / yr", image: u("1640100385267-4b935d8ef86c", 800) },
      { name: "Wuhan University", city: "Wuhan", level: "MBBS · Bachelor", intake: "September", fee: "From ¥30,000 / yr", image: u("1682082286090-0c8651b52004", 800) },
      { name: "Sun Yat-sen University", city: "Guangzhou", level: "Bachelor · Master", intake: "September", fee: "CSC eligible", image: u("1763483540869-391747165c21", 800) },
      { name: "Nanjing University", city: "Nanjing", level: "Master · PhD", intake: "September", fee: "Full scholarship", image: u("1517454376155-60f890ea84be", 800) },
      { name: "Huazhong UST", city: "Wuhan", level: "Bachelor · Master", intake: "September", fee: "From ¥22,000 / yr", image: u("1675586871481-540acf011167", 800) },
      { name: "Beijing Language & Culture", city: "Beijing", level: "Chinese language", intake: "March · September", fee: "From ¥11,000 / term", image: u("1566796096958-94dacebdcb6a", 800) },
      { name: "Tianjin University", city: "Tianjin", level: "Bachelor · Master", intake: "September", fee: "From ¥20,000 / yr", image: u("1652713057414-f45fe128e274", 800) },
      { name: "Harbin Institute of Technology", city: "Harbin", level: "Master · PhD", intake: "March · September", fee: "CSC eligible", image: u("1735107825548-e60e1e40d7ef", 800) },
    ],
  },

  cities: {
    title: ["Four cities.", "One team", "on the ground."],
    items: [
      { name: "Beijing", note: "Capital of research", detail: "Tsinghua · Peking · BLCU", image: u("1547981609-4b6bfe67ca0b", 900) },
      { name: "Shanghai", note: "Where business studies", detail: "Fudan · Jiao Tong · Tongji", image: u("1506158669146-619067262a00", 900) },
      { name: "Guangzhou", note: "Gateway of the south", detail: "Sun Yat-sen · SCUT", image: u("1768396855393-42624b5f0be5", 900) },
      { name: "Wuhan", note: "City of medicine", detail: "Wuhan University · HUST", image: u("1651076242276-971b12872930", 900) },
    ],
  },

  steps: {
    intro: ["Six steps.", "One conversation", "at a time.", "You always know", "what comes next."],
    items: [
      { title: "Free consultation", text: "We listen first: grades, goals, budget", tag: "Day 1" },
      { title: "Choose your programme", text: "A shortlist that fits you, with honest odds", tag: "Week 1" },
      { title: "Documents & application", text: "Notarised, translated, filed on time", tag: "Weeks 2–6" },
      { title: "Admission letter", text: "Your JW201 or JW202 arrives with the offer", tag: "JW201 / JW202" },
      { title: "Visa application", text: "X1 or X2 at the embassy, prepared line by line", tag: "2–4 weeks" },
      { title: "Departure & arrival", text: "Briefing, flight, pickup, residence permit", tag: "Arrival" },
    ],
  },

  faq: {
    title: ["Questions,", "answered", "plainly."],
    items: [
      { q: "Which visa do I need?", a: "Study longer than 180 days: X1. Shorter courses: X2. Employment: Z. Business trips: M. Tourism: L. Joining family in China: Q (family of Chinese citizens) or S (family of foreigners working or studying there). We confirm yours in the first call." },
      { q: "How long does it take?", a: "Plan for four to six months from first call to flight. Applications for September intakes open in winter; the visa itself usually takes two to four weeks once your JW201 or JW202 arrives." },
      { q: "What does it cost?", a: "Your consultation is free. Our fee depends on the service and is fixed in writing before you pay anything. Tuition, embassy and notary fees are paid directly and shown up front, never hidden." },
      { q: "Do I need HSK or IELTS?", a: "Chinese-taught degrees usually ask for HSK 4 or 5. English-taught programmes usually ask for IELTS 6.0 or TOEFL 80, though some accept an English-medium certificate. Language-year students need neither." },
      { q: "Can I get a scholarship?", a: "Yes, if you plan early. The Chinese Government Scholarship (CSC) usually opens in December and closes by April, alongside provincial and university awards. We match you to the ones you can realistically win." },
      { q: "What if my visa is refused?", a: "We review every file before it reaches the embassy, so refusals are rare. If it happens, we find the reason, fix it and resubmit at no extra service fee." },
    ],
  },

  footer: {
    heading: ["Your dream,", "your visa,", "our guidance."],
    sub: "Take a breath before you begin.",
    social: [
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "YouTube", href: "https://youtube.com" },
    ],
    legal: [
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "mailto:hello@explorechinabd.com" },
    ],
    credit: ["From Dhaka", "to China"],
  },

  breath: {
    inhale: "Breathe in",
    exhale: "Breathe out",
    done: "Ready when you are.",
    note: "Visa interview nerves are normal. We'll prepare you for every question.",
  },
};

export type Site = typeof site;
