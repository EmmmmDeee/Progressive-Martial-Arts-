import { db } from "../src/lib/db";

async function main() {
  console.log("🌱 Seeding PMAAI v2 (relationship model)...");

  // ---------- Arts (with program detail) ----------
  const arts = [
    {
      name: "Muay Thai", slug: "muay-thai", origin: "Thailand", focus: "Stand-up",
      description: "The Art of Eight Limbs. Develop devastating strikes using fists, elbows, knees and kicks, combined with clinch work and conditioning rooted in centuries of Thai tradition.",
      image: "/images/art-muay-thai.jpg", order: 1,
      tagline: "The Art of Eight Limbs",
      longDescription: "Muay Thai is Thailand's national sport and one of the most effective striking arts on the planet. At PMAAI we teach authentic Muay Thai as passed down through the Inosanto Academy lineage — combining the technical depth of traditional Muay Thai with modern, tested training methods. You will learn to use all eight weapons (fists, elbows, knees, kicks), develop clinch strategy, read timing and distance, and build the conditioning of a fighter.",
      suitability: "Teens and adults 13+. Suitable for complete beginners through to advanced practitioners and competitors. No prior experience needed.",
      whatYouLearn: "Boxing footwork and guard|Round kicks (teeps, body kicks)|Knee and elbow strikes|Clinch (plum) entries and sweeps|Defensive head movement and checks|Conditioning and pad holding",
      whatToBring: "Hand wraps (180 inch)|Boxing gloves 12-16oz|Mouthguard (for sparring)|Comfortable training clothes|Water bottle and towel",
      difficulty: "All Levels", minAge: 13, accentColor: "#dc2626",
    },
    {
      name: "Brazilian Jiu Jitsu", slug: "brazilian-jiu-jitsu", origin: "Brazil", focus: "Ground",
      description: "The gentle art. Learn to control and submit larger opponents using leverage, positional hierarchy and joint locks — the foundation of modern mixed martial arts ground fighting.",
      image: "/images/art-bjj.jpg", order: 2,
      tagline: "The Gentle Art. Maximum efficiency, minimum force.",
      longDescription: "Brazilian Jiu Jitsu (BJJ) proves that a smaller, weaker person can successfully defend against a bigger, stronger attacker by using proper technique and leverage. Our program follows the Machado lineage and teaches both gi and no-gi grappling. From your first class you'll learn to escape bad positions, control an opponent on the ground, and apply submissions — building real confidence that transfers to self-defence.",
      suitability: "Teens and adults 13+. All body types welcome — BJJ was designed for the smaller fighter. No fitness prerequisites.",
      whatYouLearn: "Positional hierarchy (guard, side control, mount, back)|Escapes from every bad position|Submissions: armbar, triangle, kimura, rear naked choke|Sweeps and guard retention|Takedowns adapted for BJJ|Live rolling (sparring) from day one",
      whatToBring: "Gi (available to hire)|Rash guard and shorts for no-gi|Mouthguard (optional)|Water bottle",
      difficulty: "All Levels", minAge: 13, accentColor: "#059669",
    },
    {
      name: "Kali", slug: "kali", origin: "Philippines", focus: "Weaponry",
      description: "Filipino Martial Arts training with rattan sticks, blades and empty-hands. Develop lightning reflexes, fluid footwork and an understanding of weapon-based angles of attack.",
      image: "/images/art-kali.jpg", order: 3,
      tagline: "The Filipino art of flow.",
      longDescription: "Kali (also known as Escrima or Arnis) is the national martial art of the Philippines and the weaponry system at the heart of the Inosanto Academy curriculum. Unlike most martial arts that begin empty-handed, Kali begins with weapons — single stick, double stick, stick and dagger, and edged weapons — then translates those movements to empty-hand combat. You'll develop reflexes, timing and fluid movement that transfers to every range of combat.",
      suitability: "Teens and adults 13+. Great for students who want to understand weapon defence and the angle-based Filipino martial arts philosophy.",
      whatYouLearn: "12 angles of attack|Single stick (solo baston)|Double stick (sinawali)|Stick and dagger (espada y daga)|Empty-hand translations|Disarms and counters",
      whatToBring: "Pair of rattan sticks (available to buy)|Forearm guards (recommended)|Comfortable training clothes|Water bottle",
      difficulty: "All Levels", minAge: 13, accentColor: "#d97706",
    },
    {
      name: "Jeet Kune Do", slug: "jeet-kune-do", origin: "USA", focus: "Stand-up",
      description: "Bruce Lee's intercepting fist. A philosophy and method of combat that absorbs what is useful, rejects what is useless and adds what is specifically your own.",
      image: "/images/art-jkd.jpg", order: 4,
      tagline: "Absorb what is useful. Reject what is useless.",
      longDescription: "Jeet Kune Do (JKD) is not a style but a method — Bruce Lee's personal approach to combat that became a philosophy adopted worldwide. At PMAAI we teach the original Jun Fan Gung Fu method and its evolution into JKD Concepts, exactly as preserved by Guro Dan Inosanto. You'll learn the five ways of attack, intercepting technique, and the integration of boxing, fencing footwork and wing Chun principles.",
      suitability: "Teens and adults 13+. Recommended for students interested in Bruce Lee's method, self-defence efficiency and the philosophy of personal expression in combat.",
      whatYouLearn: "The straight lead and lead-hand offence|Five ways of attack|Interception and stop-hits|Fencing-influenced footwork|Economy of motion|Trapping and energy drills",
      whatToBring: "Comfortable training clothes|Boxing gloves (for partner drills)|Focus mitts if you own them|Water bottle",
      difficulty: "Intermediate", minAge: 13, accentColor: "#7c3aed",
    },
    {
      name: "Maphilindo Silat", slug: "maphilindo-silat", origin: "SE Asia", focus: "Stand-up",
      description: "A composite system blending Malay, Filipino and Indonesian Silat. Characterised by low stances, devastating entries, sweeps and the signature compact motion of Southeast Asian arts.",
      image: "/images/art-silat.jpg", order: 5,
      tagline: "Low, fast, and devastating.",
      longDescription: "Maphilindo Silat is a synthesis developed by Guro Dan Inosanto combining Malaysian, Filipino and Indonesian Silat styles. The art is characterised by its low postures, explosive entries, brutal sweeps and takedowns, and the compact, economical motion unique to Southeast Asian martial traditions. Silat complements Kali beautifully and adds a ground-fighting and takedown dimension to your stand-up game.",
      suitability: "Teens and adults 13+. Ideal for students who already train Kali or JKD, or who want a complementary system of low-line combat.",
      whatYouLearn: "Pentjak (forms) and jurus (technique sets)|Langkah (footwork patterns)|Entries and takedowns|Joint manipulations|Counter-for-counter flow|Low-line striking",
      whatToBring: "Comfortable training clothes (knees please)|Knee pads (recommended)|Water bottle",
      difficulty: "Advanced", minAge: 13, accentColor: "#0891b2",
    },
    {
      name: "Jun Fan Gung Fu", slug: "jun-fan-gung-fu", origin: "China / USA", focus: "Stand-up",
      description: "Bruce Lee's personal gung fu method. The foundational system that evolved into Jeet Kune Do, emphasising efficiency, directness and the classical non-classical approach.",
      image: "/images/art-jun-fan.jpg", order: 6,
      tagline: "The root of Jeet Kune Do.",
      longDescription: "Jun Fan Gung Fu is Bruce Lee's foundational method, taught in Seattle, Oakland and Los Angeles before it evolved into the philosophy of Jeet Kune Do. At PMAAI we preserve this method as taught by Guro Dan Inosanto — the original techniques, drills and curriculum that build the foundation for JKD. This is the classical root that every JKD practitioner should study.",
      suitability: "Teens and adults 13+. The perfect starting point for students interested in Bruce Lee's method before progressing to JKD Concepts.",
      whatYouLearn: "Wing Chun centre-line theory|Chi sao (sticking hands)|Classical Jun Fan technique sets|Power side forward stance|Trapping hands|Kicking method",
      whatToBring: "Comfortable training clothes|Boxing gloves (for partner drills)|Water bottle",
      difficulty: "All Levels", minAge: 13, accentColor: "#be185d",
    },
  ];

  for (const a of arts) {
    await db.artDiscipline.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }
  console.log(`✓ ${arts.length} arts (with program detail)`);

  const artMap: Record<string, string> = {};
  for (const a of arts) {
    const rec = await db.artDiscipline.findUnique({ where: { slug: a.slug } });
    if (rec) artMap[a.name] = rec.id;
  }

  // ---------- Instructors (extended) ----------
  const instructors = [
    {
      id: "seed-inst-1",
      name: "Sifu Costa Vassiliou", role: "Founder & Head Instructor", specialty: "JKD · Kali · Silat",
      bio: "Founder of PMAAI with over three decades under the Inosanto Academy. Sifu Costa has trained with Guro Dan Inosanto, Sifu Francis Fong and the Machado brothers, building a curriculum that respects lineage while embracing what works.",
      image: "/images/instructor-1.jpg",
      certifications: "Certified Instructor under Guro Dan Inosanto · Full Instructor Sifu Francis Fong Wing Chun Association",
      yearsExperience: 35, order: 1,
      email: "costa@progressivemartialarts.com.au", phone: "(07) 3393 9329",
      longBio: "Costa Vassiliou founded Progressive Martial Arts Academy International in 1989, building it into one of Australia's most respected martial arts academies. A direct student of Guro Dan Inosanto since the 1980s, Costa holds full instructor certifications across the Inosanto Academy curriculum — Jeet Kune Do, Filipino Kali, and Maphilindo Silat — and is a Full Instructor under Sifu Francis Fong. Costa's teaching philosophy blends deep respect for lineage with a commitment to progressive, evidence-based training. He has hosted every major Inosanto Academy seminar in Australia for over three decades and continues to mentor the next generation of PMAAI instructors.",
      accentImage: "/images/about.jpg",
      quote: "Martial arts is for everyone. My job is to nurture your potential — wherever you start from.",
      socialInstagram: "@pmaai_brisbane", socialFacebook: "progressivemartialarts",
      startedTraining: "1980", joinedPMAAI: "1989",
      artDisciplineIds: [artMap["Jeet Kune Do"], artMap["Kali"], artMap["Maphilindo Silat"], artMap["Jun Fan Gung Fu"]].filter(Boolean).join(","),
    },
    {
      id: "seed-inst-2",
      name: "Coach Amy Tran", role: "Muay Thai & BJJ Lead", specialty: "Muay Thai · BJJ",
      bio: "A decorated competitor and nurturing coach, Amy leads both our Muay Thai and Brazilian Jiu Jitsu programs. She believes technique beats strength — and proves it every class against bigger training partners.",
      image: "/images/instructor-2.jpg",
      certifications: "WMC Level 2 Kru · Gracie University Brown Belt · Active BJJ competitor",
      yearsExperience: 14, order: 2,
      email: "amy@progressivemartialarts.com.au", phone: "(07) 3393 9329",
      longBio: "Amy Tran is PMAAI's lead Muay Thai and Brazilian Jiu Jitsu coach. A WMC Level 2 certified Kru under the World Muay Thai Council, she has trained extensively in Thailand and competed in both striking and grappling arts. Her BJJ brown belt was earned under the Machado lineage represented at PMAAI. Amy is passionate about making martial arts accessible to women and beginners, and runs PMAAI's women-only and beginner-friendly sessions. She is known for her technical, detail-oriented teaching style and her ability to break down complex techniques for new students.",
      accentImage: "/images/art-muay-thai.jpg",
      quote: "Technique beats strength. Every class proves it.",
      socialInstagram: "@amy.trains", socialFacebook: "",
      startedTraining: "2010", joinedPMAAI: "2014",
      artDisciplineIds: [artMap["Muay Thai"], artMap["Brazilian Jiu Jitsu"]].filter(Boolean).join(","),
    },
    {
      id: "seed-inst-3",
      name: "Coach Daniel Reed", role: "Strength & Conditioning", specialty: "S&C · Mobility",
      bio: "Head of Progressive Strength, Dan designs the strength and conditioning that supports every martial artist at PMAAI. From beginner movement screens to fight-camp peaking, he's the engine behind our athletes.",
      image: "/images/instructor-3.jpg",
      certifications: "ASCA Level 2 S&C Coach · Precision Nutrition L1 · FMS Level 2",
      yearsExperience: 11, order: 3,
      email: "dan@progressivestrength.com.au", phone: "(07) 3393 9329",
      longBio: "Daniel Reed heads the Progressive Strength facility next door to PMAAI. An ASCA Level 2 accredited Strength & Conditioning coach, Dan works with everyone from first-time gym members to amateur and professional fighters preparing for competition. His programming philosophy centres on building robust, mobile, powerful athletes who can sustain a lifetime of training. Dan runs the 24/7 Progressive Strength gym, personal training, and the BeastFit conditioning classes that complement the martial arts curriculum.",
      accentImage: "/images/program-strength.jpg",
      quote: "Strong people are harder to kill. Build a body that lasts.",
      socialInstagram: "@progressive.strength", socialFacebook: "",
      startedTraining: "2008", joinedPMAAI: "2015",
      artDisciplineIds: "",
    },
    {
      id: "seed-inst-4",
      name: "Coach Bill Ngata", role: "Senior Kali & Silat Instructor", specialty: "Kali · Silat · Jun Fan",
      bio: "Bill has walked the weaponry path for decades. His calm, methodical teaching unlocks the depth of Filipino and Indonesian arts — from single stick to the empty-hand translations that make Kali so complete.",
      image: "/images/instructor-4.jpg",
      certifications: "Full Instructor under Guro Dan Inosanto · Maphilindo Silat under Sifu Costa",
      yearsExperience: 28, order: 4,
      email: "bill@progressivemartialarts.com.au", phone: "(07) 3393 9329",
      longBio: "Bill Ngata is PMAAI's senior Kali and Silat instructor, with nearly three decades on the weaponry path. A Full Instructor under Guro Dan Inosanto in Filipino Martial Arts, Bill is known for his calm, methodical teaching style that slowly unlocks the depth and beauty of the Filipino and Indonesian arts. He has been a fixture at every PMAAI seminar since the 1990s and is the keeper of much of the academy's traditional curriculum.",
      accentImage: "/images/art-kali.jpg",
      quote: "The stick teaches the hand. The hand teaches the blade. All three teach the mind.",
      socialInstagram: "@bill.kali", socialFacebook: "",
      startedTraining: "1995", joinedPMAAI: "1998",
      artDisciplineIds: [artMap["Kali"], artMap["Maphilindo Silat"], artMap["Jun Fan Gung Fu"]].filter(Boolean).join(","),
    },
  ];

  for (const i of instructors) {
    await db.instructor.upsert({
      where: { id: i.id },
      update: {},
      create: i,
    });
  }
  console.log(`✓ ${instructors.length} instructors (extended)`);

  const instMap: Record<string, string> = {
    "Sifu Costa Vassiliou": "seed-inst-1",
    "Coach Amy Tran": "seed-inst-2",
    "Coach Daniel Reed": "seed-inst-3",
    "Coach Bill Ngata": "seed-inst-4",
  };

  // ---------- Products (extended) ----------
  const products = [
    {
      name: "PMAAI Official Training Tee — Black", slug: "pmaai-training-tee-black",
      description: "Premium 180gsm cotton tee with embroidered PMAAI emblem. Built for the mat, designed for the street.",
      longDescription: "Our signature training tee in heavyweight 180gsm combed cotton. Features the PMAAI emblem embroidered on the left chest and a subtle 'Stand-up · Weaponry · Ground' print on the back collar. Pre-shrunk, true to size, and built to survive thousands of training sessions and washes.",
      price: 49.99, category: "apparel", subcategory: "tshirts",
      image: "/images/art-jkd.jpg", badge: "Bestseller", rating: 4.9, reviewCount: 47,
      sku: "PMAAI-TS-BLK", weight: 220, sizes: "XS|S|M|L|XL|XXL", colors: "Black",
    },
    {
      name: "Machado Jiu Jitsu Rash Guard — Short Sleeve", slug: "machado-rash-guard-ss",
      description: "Compression-fit rash guard bearing the Jean Jacques Machado Academia logo. Moisture-wicking, IBJJF legal.",
      longDescription: "Official Jean Jacques Machado Academia rash guard. Compression fit, flatlock seams, anti-microbial treatment. Approved for IBJJF competition. The Machado brothers are part of the BJJ lineage taught at PMAAI.",
      price: 69.99, compareAt: 89.99, category: "apparel", subcategory: "rashguards",
      image: "/images/art-bjj.jpg", badge: "Sale", rating: 5.0, reviewCount: 31,
      sku: "MAC-RG-SS", weight: 180, sizes: "S|M|L|XL|XXL", colors: "Black|Blue",
    },
    {
      name: "Morgan 12oz Leather Boxing Gloves", slug: "morgan-gloves-12oz",
      description: "Hand-crafted genuine leather gloves with multi-layer foam padding. Built to last thousands of rounds.",
      longDescription: "Morgan brand 12oz leather boxing gloves. Hand-crafted from genuine cowhide leather with multi-layered IMF foam padding for knuckle protection. Thumb-attached for safety, full wrist wrap strap. The choice of serious Muay Thai and boxing students. Available in 10oz, 12oz, 14oz, 16oz.",
      price: 94.99, category: "equipment", subcategory: "gloves",
      image: "/images/art-muay-thai.jpg", badge: "Pro grade", rating: 4.8, reviewCount: 22,
      sku: "MOR-GLV-12", weight: 380, sizes: "10oz|12oz|14oz|16oz", colors: "Brown Leather|Black|Red",
    },
    {
      name: "Punch Focus Mitts — Thumpas", slug: "punch-focus-mitts-thumpas",
      description: "Lightweight curved focus mitts for sharp combination work. Pre-curved to protect coach's hands.",
      longDescription: "Punch brand Thumpas focus mitts. Lightweight, pre-curved design that absorbs impact and protects the holder's hands. Synthetic leather shell with moisture-wicking lining. Sold as a pair.",
      price: 64.99, category: "equipment", subcategory: "pads",
      image: "/images/art-jun-fan.jpg", rating: 4.7, reviewCount: 18,
      sku: "PUN-MT-THP", weight: 420, colors: "Black|Red",
    },
    {
      name: "Rattan Kali Sticks — Pair", slug: "rattan-kali-sticks-pair",
      description: "Seasoned Filipino rattan, 26 inch, traditional burn-finished. The classic choice for single and double stick training.",
      longDescription: "Pair of authentic Filipino rattan sticks, 26 inches long, traditional burn-finished for durability and grip. Seasoned for flexibility and impact resistance. The standard for Kali, Escrima and Arnis training worldwide.",
      price: 29.99, category: "equipment", subcategory: "weapons",
      image: "/images/art-kali.jpg", badge: "New", rating: 4.9, reviewCount: 64,
      sku: "KAL-STK-26", weight: 200, colors: "Natural",
    },
    {
      name: "Sifu Francis Fong 2014 — Train with the Masters DVD", slug: "sifu-francis-fong-2014-dvd",
      description: "Rare archival footage of Sifu Francis Fong's 2014 Australian seminar. Wing Chun principles, chi sao and applications.",
      longDescription: "Rare archival DVD from Sifu Francis Fong's 2014 Australian seminar hosted at PMAAI. Covers Wing Chun principles, chi sao (sticking hands), trapping and applications. A must for serious JKD and Wing Chun students. Region-free DVD, 92 minutes runtime.",
      price: 29.95, category: "media", subcategory: "dvd",
      image: "/images/about.jpg", rating: 5.0, reviewCount: 12,
      sku: "PMAAI-DVD-FF14", weight: 90,
    },
    {
      name: "Inosanto 2015 Australia — Mixed Arts 3 DVD Set", slug: "inosanto-2015-3dvd",
      description: "Complete 3-disc set of Guro Dan Inosanto's 2015 Australia seminar covering JKD, Kali and Silat.",
      longDescription: "The complete 3-disc DVD set of Guro Dan Inosanto's 2015 Australian seminar at PMAAI. Disc 1: Jeet Kune Do concepts. Disc 2: Filipino Kali. Disc 3: Maphilindo Silat. Over 4 hours of footage. A collectors item for the Inosanto lineage. Region-free, NTSC.",
      price: 124.99, category: "media", subcategory: "dvd",
      image: "/images/seminar.jpg", badge: "Limited", rating: 5.0, reviewCount: 9,
      sku: "PMAAI-DVD-IN15", weight: 240,
    },
    {
      name: "PMAAI Embroidered Fight Towel", slug: "pmaai-fight-towel",
      description: "Quick-dry microfibre towel with embroidered emblem. Essential for sweaty sessions and post-roll hygiene.",
      longDescription: "PMAAI branded quick-dry microfibre fight towel. Embroidered emblem, 90x40cm, lightweight and highly absorbent. Essential for BJJ and Muay Thai training hygiene. Available in black.",
      price: 24.99, category: "accessory", subcategory: "towels",
      image: "/images/program-strength.jpg", rating: 4.6, reviewCount: 15,
      sku: "PMAAI-TW", weight: 140, colors: "Black|Charcoal",
    },
  ];

  for (const p of products) {
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log(`✓ ${products.length} products (extended)`);

  // ---------- Classes (with relationships) ----------
  // Clear existing classes to avoid duplicates (artName field now set explicitly)
  await db.classSchedule.deleteMany({});

  const classes = [
    { day: "Monday", startTime: "06:00", endTime: "07:00", artName: "Progressive Strength", level: "All Levels", instructor: "Coach Daniel Reed", room: "Strength Gym" },
    { day: "Monday", startTime: "18:00", endTime: "19:30", artName: "Muay Thai", level: "All Levels", instructor: "Coach Amy Tran", room: "Main Mat" },
    { day: "Monday", startTime: "19:30", endTime: "21:00", artName: "Brazilian Jiu Jitsu", level: "All Levels", instructor: "Coach Amy Tran", room: "Main Mat" },
    { day: "Tuesday", startTime: "18:00", endTime: "19:30", artName: "Kali", level: "Beginner", instructor: "Coach Bill Ngata", room: "Weapons Mat" },
    { day: "Tuesday", startTime: "19:30", endTime: "21:00", artName: "Jeet Kune Do", level: "Advanced", instructor: "Sifu Costa Vassiliou", room: "Main Mat" },
    { day: "Wednesday", startTime: "06:00", endTime: "07:00", artName: "Progressive Strength", level: "All Levels", instructor: "Coach Daniel Reed", room: "Strength Gym" },
    { day: "Wednesday", startTime: "16:30", endTime: "17:30", artName: "Mini Muscles", level: "Kids", instructor: "Coach Amy Tran", room: "Kids Mat" },
    { day: "Wednesday", startTime: "18:00", endTime: "19:30", artName: "Jun Fan Gung Fu", level: "All Levels", instructor: "Sifu Costa Vassiliou", room: "Main Mat" },
    { day: "Wednesday", startTime: "19:30", endTime: "21:00", artName: "Maphilindo Silat", level: "All Levels", instructor: "Coach Bill Ngata", room: "Weapons Mat" },
    { day: "Thursday", startTime: "18:00", endTime: "19:30", artName: "Brazilian Jiu Jitsu", level: "Beginner", instructor: "Coach Amy Tran", room: "Main Mat" },
    { day: "Thursday", startTime: "19:30", endTime: "21:00", artName: "Muay Thai Sparring", level: "Advanced", instructor: "Coach Amy Tran", room: "Main Mat" },
    { day: "Friday", startTime: "06:00", endTime: "07:00", artName: "Strength Circuit", level: "All Levels", instructor: "Coach Daniel Reed", room: "Strength Gym" },
    { day: "Friday", startTime: "17:30", endTime: "18:45", artName: "Mini Muscles", level: "Kids", instructor: "Coach Amy Tran", room: "Kids Mat" },
    { day: "Friday", startTime: "19:00", endTime: "20:30", artName: "Kali & Silat", level: "All Levels", instructor: "Coach Bill Ngata", room: "Weapons Mat" },
    { day: "Saturday", startTime: "09:00", endTime: "10:30", artName: "Brazilian Jiu Jitsu", level: "All Levels", instructor: "Coach Amy Tran", room: "Main Mat" },
    { day: "Saturday", startTime: "10:30", endTime: "12:00", artName: "Jeet Kune Do", level: "All Levels", instructor: "Sifu Costa Vassiliou", room: "Main Mat" },
    { day: "Saturday", startTime: "12:00", endTime: "13:00", artName: "Mini Muscles", level: "Kids", instructor: "Coach Amy Tran", room: "Kids Mat" },
  ];

  for (const c of classes) {
    const artId = artMap[c.artName] || null;
    const instructorId = instMap[c.instructor] || null;
    await db.classSchedule.create({
      data: {
        ...c,
        artId,
        instructorId,
      },
    });
  }
  console.log(`✓ ${classes.length} classes (with relationships)`);

  // ---------- Seminars (with lifecycle) ----------
  await db.seminar.deleteMany({});
  const seminars = [
    {
      title: "Guro Dan Inosanto — Australia 2026 Seminar", guest: "Guro Dan Inosanto",
      date: new Date("2026-11-14T10:00:00+10:00"), endDate: new Date("2026-11-15T16:00:00+10:00"),
      description: "A rare two-day intensive with the living legend of JKD, Kali and Jun Fan Gung Fu. Open to all styles — expect profound insight into the arts and the philosophy that shaped modern martial arts.",
      image: "/images/seminar.jpg", spotsTotal: 40, spotsLeft: 38, price: 295,
      location: "PMAAI Dojo, Tingalpa", status: "upcoming", featured: true,
      artId: artMap["Jeet Kune Do"], instructorId: instMap["Sifu Costa Vassiliou"],
    },
    {
      title: "Sifu Francis Fong — Wing Chun & JKD 2026", guest: "Sifu Francis Fong",
      date: new Date("2026-11-21T10:00:00+10:00"), endDate: new Date("2026-11-22T15:00:00+10:00"),
      description: "Sifu Francis returns to Brisbane for a deep dive into the principles of Wing Chun and their integration with Jeet Kune Do concepts. Two days of chi sao, sensitivity and application.",
      image: "/images/art-jkd.jpg", spotsTotal: 40, spotsLeft: 25, price: 245,
      location: "PMAAI Dojo, Tingalpa", status: "upcoming", featured: false,
      artId: artMap["Jeet Kune Do"], instructorId: instMap["Sifu Costa Vassiliou"],
    },
    {
      title: "Master Jean Jacques Machado — BJJ Seminar", guest: "Master Jean Jacques Machado",
      date: new Date("2026-08-09T11:00:00+10:00"), endDate: new Date("2026-08-09T15:00:00+10:00"),
      description: "An afternoon with BJJ legend Master Jean Jacques Machado. Open to all belt levels — a unique opportunity to learn from one of the founders of Brazilian Jiu Jitsu in America.",
      image: "/images/about.jpg", spotsTotal: 40, spotsLeft: 12, price: 120,
      location: "PMAAI Dojo, Tingalpa", status: "upcoming", featured: false,
      artId: artMap["Brazilian Jiu Jitsu"], instructorId: instMap["Coach Amy Tran"],
    },
  ];
  for (const s of seminars) {
    await db.seminar.create({ data: s });
  }
  console.log(`✓ ${seminars.length} seminars (with lifecycle)`);

  // ---------- FAQs ----------
  await db.faq.deleteMany({});
  const faqs = [
    { question: "Do I need any experience to start?", answer: "Absolutely not. The majority of our students start as complete beginners. Every art has dedicated beginner-friendly classes and our instructors are experienced at scaling techniques for first-timers. Your first class is free — just arrive 15 minutes early.", category: "general", order: 1 },
    { question: "What should I wear to my first class?", answer: "Comfortable training clothes (t-shirt and shorts or tracksuit pants) and a water bottle are all you need for your first session. For Muay Thai we can loan you gloves and hand wraps. For BJJ you can train no-gi in a rash guard or t-shirt. Once you decide to continue we'll help you get the right gear from our shop.", category: "general", order: 2 },
    { question: "How much does membership cost?", answer: "We offer flexible memberships starting from a single-art casual pass through to unlimited all-arts memberships. Concession, student and family discounts are available. The best way to find the right option is to book a free trial and chat with our team about your goals.", category: "membership", order: 3 },
    { question: "Is martial arts safe?", answer: "Safety is our first priority. All classes are supervised by certified instructors, technique is taught progressively, and sparring is optional and closely controlled. Injuries are far less common than in most contact sports. We scale intensity to your experience and comfort level.", category: "general", order: 4 },
    { question: "I'm not fit — can I still train?", answer: "Yes. Martial arts will get you fit — you don't need to be fit to start. Every class scales to your level, and our Progressive Strength gym next door can build you a conditioning plan if you want extra support. Many of our students started deconditioned.", category: "general", order: 5 },
    { question: "What age can my child start?", answer: "Our Mini Muscles program welcomes children from age 5. The program is built around age-appropriate martial arts, movement and play to develop coordination, confidence and discipline in a fun, structured environment.", category: "kids", order: 6 },
    { question: "Do I need my own gloves/equipment?", answer: "For your first few classes we can loan you everything you need. Once you commit to training, owning your own gloves, wraps and eventually a gi/rash guard is recommended for hygiene and fit. Our shop stocks everything you'll need at member pricing.", category: "general", order: 7 },
    { question: "How often should I train?", answer: "Beginners see great progress training 2-3 times per week. Consistency matters more than volume — two classes a week for a year will transform you. As you progress you may want to train more, and our timetable offers classes six days a week.", category: "general", order: 8 },
  ];
  for (const f of faqs) {
    await db.faq.create({ data: f });
  }
  console.log(`✓ ${faqs.length} FAQs`);

  // ---------- Media (galleries) ----------
  await db.media.deleteMany({});
  const mediaItems = [
    { title: "Muay Thai roundhouse", url: "/images/art-muay-thai.jpg", type: "image", category: "training", caption: "Coach Amy demonstrating the roundhouse kick", year: 2024, artId: artMap["Muay Thai"] },
    { title: "BJJ positional drill", url: "/images/art-bjj.jpg", type: "image", category: "training", caption: "Side control escape drill", year: 2024, artId: artMap["Brazilian Jiu Jitsu"] },
    { title: "Kali single stick flow", url: "/images/art-kali.jpg", type: "image", category: "training", caption: "Coach Bill on the weapons mat", year: 2023, artId: artMap["Kali"] },
    { title: "JKD straight lead", url: "/images/art-jkd.jpg", type: "image", category: "training", caption: "The lead-hand offence of JKD", year: 2024, artId: artMap["Jeet Kune Do"] },
    { title: "Silat entry", url: "/images/art-silat.jpg", type: "image", category: "training", caption: "Low-line Silat entry", year: 2023, artId: artMap["Maphilindo Silat"] },
    { title: "Jun Fan chi sao", url: "/images/art-jun-fan.jpg", type: "image", category: "training", caption: "Sticking hands sensitivity drill", year: 2024, artId: artMap["Jun Fan Gung Fu"] },
    { title: "Mini Muscles in action", url: "/images/program-kids.jpg", type: "image", category: "kids", caption: "Mini Muscles developing coordination", year: 2024 },
    { title: "Progressive Strength gym", url: "/images/program-strength.jpg", type: "image", category: "academy", caption: "Our 24/7 strength facility", year: 2024 },
    { title: "Guro Dan Inosanto seminar", url: "/images/seminar.jpg", type: "image", category: "event", caption: "Guro Dan teaching at PMAAI", year: 2023 },
    { title: "Academy heritage wall", url: "/images/about.jpg", type: "image", category: "historical", caption: "Decades of lineage on the wall", year: 2023 },
    { title: "Sifu Costa portrait", url: "/images/instructor-1.jpg", type: "image", category: "instructor", caption: "Founder Sifu Costa Vassiliou", year: 2024 },
    { title: "Coach Amy portrait", url: "/images/instructor-2.jpg", type: "image", category: "instructor", caption: "Coach Amy Tran", year: 2024 },
  ];
  for (const m of mediaItems) {
    await db.media.create({ data: m });
  }
  console.log(`✓ ${mediaItems.length} media items`);

  // ---------- Testimonials (re-seed) ----------
  await db.testimonial.deleteMany({});
  const testimonials = [
    { id: "seed-test-1", name: "James Whitfield", role: "Student · 3 years", content: "I walked in at 42 with zero experience and a bad back. Three years on I'm fitter than my twenties and just earned my blue belt. The coaches genuinely care about your journey, not your wallet.", rating: 5, image: "/images/student-1.jpg", art: "Brazilian Jiu Jitsu", order: 1 },
    { id: "seed-test-2", name: "Priya Sharma", role: "Student · 18 months", content: "As a woman I was nervous about joining a martial arts gym. PMAAI could not have been more welcoming. Amy's Muay Thai class is tough, technical and totally ego-free. I've never felt stronger.", rating: 5, image: "/images/student-2.jpg", art: "Muay Thai", order: 2 },
    { id: "seed-test-3", name: "Mark Donnelly", role: "Parent of two Mini Muscles", content: "Both my kids train in Mini Muscles and the change in their confidence, discipline and coordination has been incredible. The coaches balance fun and structure perfectly. Worth every cent.", rating: 5, image: "/images/student-3.jpg", art: "Mini Muscles", order: 3 },
    { id: "seed-test-4", name: "Sara Lin", role: "Student · 5 years", content: "The breadth here is unreal. Where else can you train Kali sticks one night, BJJ the next, then Muay Thai sparring? The Inosanto lineage is real and the community feels like family.", rating: 5, image: "/images/student-2.jpg", art: "Kali", order: 4 },
    { id: "seed-test-5", name: "Dave Robertson", role: "Student · 7 years", content: "I've trained at a lot of gyms. The coaching quality at PMAAI is genuinely world-class and the Progressive Strength gym next door means I never have to go anywhere else. One membership, everything I need.", rating: 5, image: "/images/student-1.jpg", art: "Jeet Kune Do", order: 5 },
    { id: "seed-test-6", name: "Michelle Carter", role: "Student · 2 years", content: "Silat changed how I move. Bill's teaching is patient and deep — every class I learn something that makes the whole art click. Best decision I made was walking through that door.", rating: 5, image: "/images/student-2.jpg", art: "Maphilindo Silat", order: 6 },
  ];
  for (const t of testimonials) {
    await db.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }
  console.log(`✓ ${testimonials.length} testimonials`);

  console.log("🎉 Seed v2 complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
