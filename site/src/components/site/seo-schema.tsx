import { siteConfig } from "@/lib/site-config";

// Schema.org JSON-LD for LocalBusiness (Martial Arts School) + WebSite
export function SeoSchema() {
  const business = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "@id": "https://progressivemartialarts.com.au/#business",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: "https://progressivemartialarts.com.au/",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: "https://progressivemartialarts.com.au/images/hero-bg.jpg",
    logo: "https://progressivemartialarts.com.au/images/emblem.png",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: "Tingalpa",
      addressRegion: "QLD",
      postalCode: "4173",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -27.4833,
      longitude: 153.1667,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "06:00",
        closes: "21:00",
      },
    ],
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.social.youtube],
    areaServed: {
      "@type": "City",
      name: "Brisbane",
    },
    knowsAbout: [
      "Muay Thai",
      "Brazilian Jiu Jitsu",
      "Kali",
      "Jeet Kune Do",
      "Maphilindo Silat",
      "Jun Fan Gung Fu",
      "Self Defence",
      "Kids Martial Arts",
      "Strength and Conditioning",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://progressivemartialarts.com.au/#website",
    url: "https://progressivemartialarts.com.au/",
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": "https://progressivemartialarts.com.au/#business" },
    inLanguage: "en-AU",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://progressivemartialarts.com.au/" },
      { "@type": "ListItem", position: 2, name: "Arts We Teach", item: "https://progressivemartialarts.com.au/#arts" },
      { "@type": "ListItem", position: 3, name: "Timetable", item: "https://progressivemartialarts.com.au/#timetable" },
      { "@type": "ListItem", position: 4, name: "Instructors", item: "https://progressivemartialarts.com.au/#instructors" },
      { "@type": "ListItem", position: 5, name: "Contact", item: "https://progressivemartialarts.com.au/#contact" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
