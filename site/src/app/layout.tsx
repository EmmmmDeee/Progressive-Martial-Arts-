import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://progressivemartialarts.com.au"),
  title: {
    default: "Progressive Martial Arts Academy International | Brisbane",
    template: "%s | PMAAI Brisbane",
  },
  description:
    "Brisbane's premier martial arts academy. Train in Muay Thai, Brazilian Jiu Jitsu, Kali, Jeet Kune Do, Maphilindo Silat & Jun Fan Gung Fu under the lineage of Guro Dan Inosanto. Kids classes, 24/7 gym & seminars. First class free.",
  keywords: [
    "martial arts Brisbane",
    "Muay Thai Brisbane",
    "BJJ Brisbane",
    "Brazilian Jiu Jitsu Brisbane",
    "Kali Brisbane",
    "Jeet Kune Do",
    "Maphilindo Silat",
    "Jun Fan Gung Fu",
    "self defence Brisbane",
    "kids martial arts Brisbane",
    "Mini Muscles",
    "Progressive Strength",
    "Progressive Martial Arts",
    "PMAAI",
    "Inosanto lineage",
    "martial arts Tingalpa",
    "24/7 gym Brisbane",
  ],
  authors: [{ name: "Progressive Martial Arts Academy International" }],
  creator: "Progressive Martial Arts Academy International",
  publisher: "Progressive Martial Arts Academy International",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/images/emblem.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/images/emblem.png",
  },
  openGraph: {
    title: "Progressive Martial Arts Academy International | Brisbane",
    description:
      "Train in authentic martial arts under the Inosanto lineage. Muay Thai, BJJ, Kali, JKD, Silat & Jun Fan Gung Fu in Brisbane. Kids classes, 24/7 gym & seminars. First class free.",
    url: "https://progressivemartialarts.com.au/",
    siteName: "Progressive Martial Arts Academy International",
    type: "website",
    locale: "en_AU",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1344,
        height: 768,
        alt: "Martial arts dojo at Progressive Martial Arts Academy Brisbane",
      },
      {
        url: "/images/emblem.png",
        width: 1024,
        height: 1024,
        alt: "PMAAI emblem — Progressive Martial Arts Academy International",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Progressive Martial Arts Academy International | Brisbane",
    description:
      "Brisbane's premier martial arts academy under the Inosanto lineage. Muay Thai, BJJ, Kali, JKD, Silat & Jun Fan. First class free.",
    images: ["/images/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "sports",
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Tingalpa, Brisbane",
    "geo.position": "-27.4833;153.1667",
    ICBM: "-27.4833, 153.1667",
  },
};

export const viewport = {
  themeColor: "#dc2626",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${bebas.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
