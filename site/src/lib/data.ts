import { db } from "@/lib/db";

// ---------- Types ----------
export type ArtDisciplineT = {
  id: string;
  name: string;
  slug: string;
  origin: string;
  description: string;
  focus: string;
  image: string;
  icon?: string | null;
  order: number;
  tagline?: string | null;
  longDescription?: string | null;
  suitability?: string | null;
  whatYouLearn?: string | null;
  whatToBring?: string | null;
  difficulty: string;
  minAge: number;
  accentColor?: string | null;
};

export type InstructorT = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  image: string;
  certifications?: string | null;
  yearsExperience: number;
  order: number;
  email?: string | null;
  phone?: string | null;
  longBio?: string | null;
  accentImage?: string | null;
  quote?: string | null;
  socialInstagram?: string | null;
  socialFacebook?: string | null;
  startedTraining?: string | null;
  joinedPMAAI?: string | null;
  artDisciplineIds?: string;
};

export type ProductT = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string | null;
  price: number;
  compareAt?: number | null;
  category: string;
  subcategory?: string | null;
  image: string;
  gallery?: string | null;
  badge?: string | null;
  inStock: boolean;
  stockQty: number;
  sku?: string | null;
  rating: number;
  reviewCount: number;
  weight?: number | null;
  sizes?: string | null;
  colors?: string | null;
};

export type ClassScheduleT = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  level: string;
  instructor: string;
  room: string;
  capacity: number;
  notes?: string | null;
  artId?: string | null;
  artName: string;
  instructorId?: string | null;
};

export type SeminarT = {
  id: string;
  title: string;
  guest: string;
  date: string;
  endDate?: string | null;
  description: string;
  image: string;
  spotsTotal: number;
  spotsLeft: number;
  price: number;
  location: string;
  status: string;
  featured: boolean;
  galleryUrl?: string | null;
  artId?: string | null;
  instructorId?: string | null;
};

export type TestimonialT = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string | null;
  art?: string | null;
  order: number;
};

export type FaqT = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  artId?: string | null;
};

export type MediaT = {
  id: string;
  title: string;
  url: string;
  thumbnail?: string | null;
  type: string;
  category: string;
  caption?: string | null;
  year?: number | null;
  artId?: string | null;
};

export type OrderT = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postcode?: string | null;
  state?: string | null;
  country: string;
  items: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  notes?: string | null;
  createdAt: string;
};

// ---------- Data access ----------
const DAY_ORDER: Record<string, number> = {
  Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7,
};

function sortClasses<T extends { day: string; startTime: string }>(a: T, b: T) {
  const d = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
  if (d !== 0) return d;
  return a.startTime.localeCompare(b.startTime);
}

export async function getArts(): Promise<ArtDisciplineT[]> {
  try {
    return await db.artDiscipline.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("getArts failed:", e);
    return [];
  }
}

export async function getArtBySlug(slug: string): Promise<ArtDisciplineT | null> {
  try {
    return await db.artDiscipline.findUnique({ where: { slug } });
  } catch (e) {
    console.error("getArtBySlug failed:", e);
    return null;
  }
}

export async function getInstructors(): Promise<InstructorT[]> {
  try {
    return await db.instructor.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("getInstructors failed:", e);
    return [];
  }
}

export async function getInstructorById(id: string): Promise<InstructorT | null> {
  try {
    return await db.instructor.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function getProducts(limit?: number): Promise<ProductT[]> {
  try {
    return await db.product.findMany({
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });
  } catch (e) {
    console.error("getProducts failed:", e);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductT | null> {
  try {
    return await db.product.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function getClasses(): Promise<ClassScheduleT[]> {
  try {
    const classes = await db.classSchedule.findMany({
      include: { art: true },
    });
    const mapped = classes.map((c) => ({
      id: c.id,
      day: c.day,
      startTime: c.startTime,
      endTime: c.endTime,
      level: c.level,
      instructor: c.instructor,
      room: c.room,
      capacity: c.capacity,
      notes: c.notes,
      artId: c.artId,
      artName: c.art?.name || c.artName,
      instructorId: c.instructorId,
    }));
    return mapped.sort(sortClasses);
  } catch (e) {
    console.error("getClasses failed:", e);
    return [];
  }
}

export async function getSeminars(): Promise<SeminarT[]> {
  try {
    const seminars = await db.seminar.findMany({ orderBy: { date: "asc" } });
    return seminars.map((s) => ({
      ...s,
      date: s.date.toISOString(),
      endDate: s.endDate ? s.endDate.toISOString() : null,
    }));
  } catch (e) {
    console.error("getSeminars failed:", e);
    return [];
  }
}

export async function getSeminarById(id: string): Promise<SeminarT | null> {
  try {
    const s = await db.seminar.findUnique({ where: { id } });
    if (!s) return null;
    return {
      ...s,
      date: s.date.toISOString(),
      endDate: s.endDate ? s.endDate.toISOString() : null,
    };
  } catch {
    return null;
  }
}

export async function getTestimonials(): Promise<TestimonialT[]> {
  try {
    return await db.testimonial.findMany({ orderBy: { order: "asc" } });
  } catch (e) {
    console.error("getTestimonials failed:", e);
    return [];
  }
}

export async function getFaqs(artId?: string): Promise<FaqT[]> {
  try {
    return await db.faq.findMany({
      where: artId ? { OR: [{ artId }, { artId: null, category: "general" }] } : undefined,
      orderBy: { order: "asc" },
    });
  } catch (e) {
    console.error("getFaqs failed:", e);
    return [];
  }
}

export async function getMedia(category?: string, artId?: string): Promise<MediaT[]> {
  try {
    return await db.media.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(artId ? { artId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("getMedia failed:", e);
    return [];
  }
}

export async function createOrder(data: Omit<OrderT, "id" | "createdAt" | "status">) {
  try {
    return await db.order.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        postcode: data.postcode || null,
        state: data.state || null,
        country: data.country || "Australia",
        items: data.items,
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
        notes: data.notes || null,
        status: "pending",
      },
    });
  } catch (e) {
    console.error("createOrder failed:", e);
    throw e;
  }
}

export async function getOrder(id: string): Promise<OrderT | null> {
  try {
    const o = await db.order.findUnique({ where: { id } });
    if (!o) return null;
    return { ...o, createdAt: o.createdAt.toISOString() };
  } catch {
    return null;
  }
}
