// Central site configuration for Progressive Martial Arts Academy International (PMAAI)

export const siteConfig = {
  name: "Progressive Martial Arts Academy International",
  shortName: "PMAAI",
  tagline: "Stand-up. Weaponry. Ground.",
  description:
    "Brisbane's premier martial arts academy under the lineage of Guro Dan Inosanto. Teaching a progressive system across stand-up, weaponry and ground fighting.",
  phone: "(07) 3393 9329",
  phoneHref: "tel:+61733939329",
  mobile: "0412 400 836",
  mobileHref: "tel:+61412400836",
  email: "info@progressivemartialarts.com.au",
  emailHref: "mailto:info@progressivemartialarts.com.au",
  address: {
    line1: "180 New Cleveland Road",
    line2: "Tingalpa QLD 4173",
    postal: "PO Box 9106, Wynnum Plaza, Wynnum QLD 4178",
  },
  hours: "Mon–Sat · 6am–9pm",
  established: 1989,
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Arts We Teach", href: "#arts" },
    { label: "Programs", href: "#programs" },
    { label: "Timetable", href: "#timetable" },
    { label: "Instructors", href: "#instructors" },
    { label: "Shop", href: "#shop" },
    { label: "Seminars", href: "#seminars" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
