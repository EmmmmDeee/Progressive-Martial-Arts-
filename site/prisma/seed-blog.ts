import { db } from "../src/lib/db";

const articles = [
  {
    title: "Which Martial Art Is Right For You? A Brisbane Beginner's Guide",
    slug: "which-martial-art-is-right-for-you",
    excerpt: "Muay Thai, BJJ, Kali, JKD, Silat or Jun Fan? We break down what each art offers, who it suits, and how to choose your starting point at PMAAI.",
    category: "training",
    tags: "beginners|muay-thai|bjj|kali|jkd|silat",
    image: "/images/hero-bg.jpg",
    authorName: "Sifu Costa Vassiliou",
    featured: true,
    readMinutes: 6,
    content: `Choosing your first martial art can feel overwhelming. At PMAAI we teach six distinct disciplines, each with its own character, demands and rewards. Here's a plain-English guide to help you find your starting point.

## Muay Thai — the Art of Eight Limbs

If you want to get fit fast while learning devastating striking, Muay Thai is hard to beat. You'll use fists, elbows, knees and kicks, plus clinch work. It's high-intensity, cardio-heavy and produces visible results quickly. Perfect for beginners who want a workout as much as a martial art.

## Brazilian Jiu Jitsu — the gentle art

BJJ proves a smaller person can defeat a bigger one using leverage and technique. It's strategic, technical and deeply rewarding. If you've ever felt outmatched by size, BJJ is your answer. The ground game is addictive — many students describe it as physical chess.

## Kali — the Filipino art of flow

Kali begins with weapons (rattan sticks) and translates to empty hands. It develops reflexes, footwork and an understanding of angles unlike any other art. If the weaponry side of martial arts fascinates you, Kali is your home.

## Jeet Kune Do & Jun Fan Gung Fu — Bruce Lee's method

JKD is Bruce Lee's philosophy of absorbing what is useful. Jun Fan is his foundational method. These arts suit students interested in efficiency, directness and the philosophical side of combat.

## Maphilindo Silat — low, fast, devastating

Silat complements Kali beautifully with its low stances, explosive entries and takedowns. Often chosen by students who already train Kali or JKD.

## The honest truth

You don't have to choose perfectly. Your first class is free, and our Unlimited All-Arts membership lets you try everything. Most students find their fit within a few weeks. The best martial art for you is the one you'll actually train consistently.

**Not sure?** Try our [Discipline Selector quiz](#discipline-selector), or just call us on (07) 3393 9329 — we love helping people find their path.`,
  },
  {
    title: "Guro Dan Inosanto: The Living Legend Behind PMAAI's Lineage",
    slug: "guro-dan-inosanto-living-legend",
    excerpt: "How a student of Bruce Lee became one of martial arts' most influential figures — and why his lineage matters for every student who trains at PMAAI.",
    category: "lineage",
    tags: "lineage|bruce-lee|inosanto|history",
    image: "/images/about.jpg",
    authorName: "Coach Bill Ngata",
    featured: false,
    readMinutes: 5,
    content: `When you train at PMAAI, you're not just learning techniques — you're part of a living lineage that runs directly back through Guro Dan Inosanto to Bruce Lee himself.

## A student of Bruce Lee

Dan Inosanto was one of Bruce Lee's most dedicated students and close friends. After Lee's passing in 1973, Inosanto became the primary preserver of Lee's Jeet Kune Do and Jun Fan Gung Fu methods. He is one of only three people ever certified by Lee to teach JKD.

## More than JKD

What makes Guro Dan extraordinary is his breadth. Beyond JKD, he is a master of Filipino Martial Arts (Kali, Escrima, Arnis), Maphilindo Silat, and numerous other arts. His philosophy has always been to absorb what is useful from every source — exactly Lee's approach.

## The Inosanto Academy

The Inosanto Academy of Martial Arts in Los Angeles is the global home of this lineage. PMAAI is a direct affiliate, and Sifu Costa Vassiliou holds full instructor certifications under Guro Dan.

## Why lineage matters

In an era of online tutorials and belt-by-subscription, authentic lineage is rare. It means your instructors were taught by someone who was taught by someone — an unbroken chain of knowledge passed hand to hand. The details, the feel, the principles that can't be captured in a video — that's what lineage preserves.

## Train with the masters

Each year Guro Dan visits Australia for seminars at PMAAI. These are once-in-a-lifetime opportunities to learn from a living legend. [Check our events page](#/events) for the next seminar.`,
  },
  {
    title: "5 Reasons Your Child Should Try Martial Arts (That Aren't Self-Defence)",
    slug: "5-reasons-kids-martial-arts",
    excerpt: "Self-defence is obvious — but the real benefits of kids martial arts are confidence, focus, discipline, friendships and fun. Here's what parents actually see.",
    category: "kids",
    tags: "kids|mini-muscles|parents|confidence",
    image: "/images/program-kids.jpg",
    authorName: "Coach Amy Tran",
    featured: false,
    readMinutes: 4,
    content: `Parents enrol their kids in martial arts thinking about self-defence. Six months later, they tell us about the changes they didn't expect.

## 1. Confidence that radiates

There's something about earning a belt, landing a technique, or just surviving a tough class that builds genuine self-belief. Kids who were shy start making eye contact. Kids who hung back start raising their hand.

## 2. Focus and discipline

Martial arts requires attention to detail. Kids learn to listen, follow instructions, and practise deliberately. Parents regularly tell us this transfers to school and home.

## 3. Physical literacy

In an era of screens, many kids lack basic coordination. Martial arts develops balance, agility, body awareness and motor control in a structured way that feels like play.

## 4. Real friendships

Training partners become friends. Kids bond over shared challenges — the first sparring session, the belt test, the tough workout. These friendships tend to stick.

## 5. Resilience

Martial arts teaches you to get up after being knocked down — literally and figuratively. Kids learn that struggle is part of growth, not a reason to quit.

## The best part

At PMAAI, kids train in [Mini Muscles](#/kids) — a program built around age-appropriate martial arts, play and movement. Your child's first class is free. [Book a trial](#contact) and see the smiles for yourself.`,
  },
  {
    title: "Strength Training for Martial Arts: Why We Built Progressive Strength",
    slug: "strength-training-for-martial-arts",
    excerpt: "Why every martial artist needs strength training, how it complements your mat time, and what makes our 24/7 gym different from a commercial chain.",
    category: "training",
    tags: "strength|conditioning|progressive-strength",
    image: "/images/program-strength.jpg",
    authorName: "Coach Daniel Reed",
    featured: false,
    readMinutes: 5,
    content: `You can be the most technical martial artist on the mat — if you lack the strength to execute under fatigue, technique alone won't save you. That's why we built Progressive Strength.

## Strength is a skill

Strength isn't about being big. It's about producing force efficiently, absorbing impact, and staying durable over years of training. A well-built martial artist is harder to injure, hits harder, and recovers faster.

## Why a dedicated gym?

Commercial gyms are built for general fitness. Progressive Strength is built for martial artists — the equipment, the programming, the culture. Our coaches understand what a BJJ player needs versus a Muay Thai fighter versus a Kali practitioner.

## What we offer

- 24/7 swipe access for members
- Kettlebells, free weights, cable machines
- Conditioning circuits and assault bikes
- Personal training tailored to your art
- Movement screening for injury prevention

## How it complements the mat

Two strength sessions a week alongside your martial arts training will transform your game. You'll move better, hit harder, and last longer. And because the gym is right next door to the dojo, there's no excuse.

## Members get access

Unlimited All-Arts and Single Art memberships include Progressive Strength access. [See our pricing](#pricing) or [book a trial](#contact) to get started.`,
  },
  {
    title: "The Machado Brothers: Brisbane's BJJ Connection",
    slug: "machado-brothers-bjj-connection",
    excerpt: "How the Machado brothers brought Brazilian Jiu Jitsu to the world — and why their lineage lives on the mats at PMAAI every week.",
    category: "lineage",
    tags: "bjj|lineage|machado|history",
    image: "/images/art-bjj.jpg",
    authorName: "Coach Amy Tran",
    featured: false,
    readMinutes: 4,
    content: `When you train BJJ at PMAAI, you're part of the Machado lineage — one of the most respected in Brazilian Jiu Jitsu history.

## The five brothers

The Machado brothers — Carlos, Roger, Rigan, Jean Jacques and John — are nephews of Carlos Gracie Sr., one of BJJ's founders. They grew up training with the Gracie family and became world champions in their own right.

## Jean Jacques Machado

Master Jean Jacques Machado is the BJJ lineage PMAAI is most connected to. A decorated competitor despite being born with a congenital hand condition, he's proof that technique truly beats physical gifts. He visits PMAAI regularly for seminars.

## Why lineage matters in BJJ

In BJJ, lineage is everything. It determines the principles you're taught, the techniques you prioritise, and the culture of the gym. The Machado style is known for being technical, pressure-based and accessible to all body types.

## Train the lineage

Every BJJ class at PMAAI carries this lineage forward. [Book a free trial](#contact) and feel it for yourself.`,
  },
  {
    title: "What To Expect At Your First Muay Thai Class",
    slug: "first-muay-thai-class",
    excerpt: "Nervous about your first Muay Thai session? Here's exactly what happens, what to bring, and why you'll be hooked by the end of round one.",
    category: "training",
    tags: "muay-thai|beginners|first-class",
    image: "/images/art-muay-thai.jpg",
    authorName: "Coach Amy Tran",
    featured: false,
    readMinutes: 4,
    content: `Walking into a martial arts gym for the first time is intimidating. Let's remove the mystery so you can focus on the fun part — training.

## Before you arrive

Wear comfortable workout clothes (t-shirt and shorts). Bring a water bottle and a towel. You don't need gloves or wraps for your first class — we loan them free.

## When you arrive

Come 15 minutes early. We'll show you around, introduce you to your instructor, and fit you with loaner gloves and hand wraps. You'll meet a few regulars — PMAAI is ego-free and welcoming.

## The class structure

A typical Muay Thai class runs 90 minutes:

1. **Warm-up** (10-15 min) — skipping, shadow boxing, mobility
2. **Technique instruction** (15 min) — the coach demos a technique, you drill it
3. **Pad work or bag work** (30 min) — you apply the technique with a partner or on the bag
4. **Conditioning** (15 min) — core, strength, cardio circuits
5. **Cool-down** (5 min) — stretching

## What if I can't keep up?

You will. Every drill is scaled to your level. If you need to rest, rest. Nobody judges — we've all been the new person. The only expectation is that you try.

## After class

Say hi to your training partners. Ask the coach any questions. Hydrate. You'll probably be sore tomorrow — that's normal and it fades as you train consistently.

## Ready?

Your first class is free. [Book it now](#contact) — your future self will thank you.`,
  },
];

async function main() {
  console.log("🌱 Seeding blog articles...");
  for (const a of articles) {
    await db.blogArticle.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        ...a,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`✓ ${articles.length} blog articles`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
