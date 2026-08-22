import { NextResponse } from "next/server";
import { z } from "zod";
import ZAI from "z-ai-web-dev-sdk";

// Lazy-init the ZAI SDK so cold starts are fast and we reuse the instance.
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;
async function getZai() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

const PMAAI_SYSTEM_PROMPT = `You are the virtual assistant for Progressive Martial Arts Academy International (PMAAI), a Brisbane martial arts academy founded in 1989 by Sifu Costa Vassiliou.

ABOUT PMAAI:
- Located at 180 New Cleveland Road, Tingalpa QLD 4173, Australia
- Phone: (07) 3393 9329, Mobile: 0412 400 836
- Directly affiliated with the Inosanto Academy of Martial Arts (Guro Dan Inosanto lineage)
- Teaches 6 martial arts: Muay Thai, Brazilian Jiu Jitsu (BJJ), Kali (Filipino weaponry), Jeet Kune Do (Bruce Lee's method), Maphilindo Silat, and Jun Fan Gung Fu
- Also runs: Mini Muscles (kids program ages 5-12), Progressive Strength (24/7 strength gym next door)
- Classes Monday-Saturday, 17 weekly classes
- Membership: Casual $30/class, Single Art $45/week, Unlimited All-Arts $65/week (most popular), Family $120/week. No lock-in contracts. First class is FREE.
- Annual seminars with Guro Dan Inosanto, Sifu Francis Fong, Master Jean Jacques Machado
- 4 certified instructors: Sifu Costa Vassiliou (Founder, JKD/Kali/Silat), Coach Amy Tran (Muay Thai/BJJ lead), Coach Daniel Reed (Strength & Conditioning), Coach Bill Ngata (Kali/Silat/Jun Fan)

YOUR ROLE:
- Be a friendly, knowledgeable, encouraging virtual assistant who helps visitors find the right martial art, understand what to expect, and book a free trial class
- Answer questions about: which art is right for them, what to wear/bring, class times, pricing, kids classes, fitness level needed, safety, the Inosanto lineage, and the academy
- Keep responses concise (2-4 sentences typically, max 6 sentences). Use a warm, encouraging tone.
- When someone is ready to visit or book, direct them to: call (07) 3393 9329, or use the contact form on the website to book a free trial class
- If asked about something you don't know, suggest calling the academy
- Never make up specific prices, schedules, or facts not listed above
- Do not discuss politics, religion, or controversial topics — redirect to martial arts

LINEAGE CONTEXT:
- Bruce Lee founded Jeet Kune Do (JKD) and Jun Fan Gung Fu
- Guro Dan Inosanto was Bruce Lee's student and preserves the JKD/Kali/Silat lineage
- The Machado brothers represent the BJJ lineage taught at PMAAI
- Sifu Francis Fong teaches the Wing Chun component integrated into JKD concepts`;

const schema = z.object({
  message: z.string().min(1, "Message is required").max(1000, "Message too long"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .max(20)
    .default([]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { message, history } = parsed.data;
    const zai = await getZai();

    const messages = [
      { role: "assistant" as const, content: PMAAI_SYSTEM_PROMPT },
      ...history.slice(-8).map((h) => ({
        role: h.role === "user" ? ("user" as const) : ("assistant" as const),
        content: h.content,
      })),
      { role: "user" as const, content: message },
    ];

    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
    });

    const response =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response. Please try again or call us on (07) 3393 9329.";

    return NextResponse.json({ ok: true, response });
  } catch (e) {
    console.error("chat POST error:", e);
    return NextResponse.json(
      {
        ok: false,
        error: "Sorry, I'm having trouble responding right now. Please call us on (07) 3393 9329.",
      },
      { status: 500 }
    );
  }
}
