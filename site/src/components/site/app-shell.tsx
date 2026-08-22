"use client";

import { RouterProvider, useRouter } from "@/lib/router";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CartDrawer } from "@/components/site/cart-drawer";
import { HomePage } from "@/components/site/home-page";
import { ProgramDetail } from "@/components/site/program-detail";
import { ShopPage } from "@/components/site/shop-page";
import { ProductDetail } from "@/components/site/product-detail";
import { CheckoutPage } from "@/components/site/checkout-page";
import { OrderSuccess } from "@/components/site/order-success";
import { Timetable } from "@/components/site/timetable";
import { InstructorsPage } from "@/components/site/instructors-page";
import { InstructorDetail } from "@/components/site/instructor-detail";
import { EventsPage } from "@/components/site/events-page";
import { EventDetail } from "@/components/site/event-detail";
import { HistoryPage } from "@/components/site/history-page";
import { NotFoundPage } from "@/components/site/not-found";
import { Contact as ContactSection } from "@/components/site/contact";
import { ScrollUtilities } from "@/components/site/scroll-utilities";
import { KidsPage } from "@/components/site/kids-page";
import { GalleryPage } from "@/components/site/gallery-page";
import { ChatbotWidget } from "@/components/site/chatbot-widget";
import { BlogPage } from "@/components/site/blog-page";
import { ArticleDetail } from "@/components/site/article-detail";

function RouteView() {
  const { route } = useRouter();
  switch (route.name) {
    case "home":
      return <HomePage />;
    case "program":
      return <ProgramDetail slug={route.slug} />;
    case "shop":
      return <ShopPage />;
    case "product":
      return <ProductDetail slug={route.slug} />;
    case "cart":
      // Cart is a drawer; redirect-ish: show shop with drawer open
      return <ShopPage />;
    case "checkout":
      return <CheckoutPage />;
    case "order-success":
      return <OrderSuccess id={route.id} />;
    case "timetable":
      return <TimetablePage />;
    case "instructors":
      return <InstructorsPage />;
    case "instructor":
      return <InstructorDetail slug={route.slug} />;
    case "events":
      return <EventsPage />;
    case "event":
      return <EventDetail slug={route.slug} />;
    case "history":
      return <HistoryPage />;
    case "contact":
      return <ContactStandalone />;
    case "kids":
      return <KidsPage />;
    case "blog":
      return <BlogPage />;
    case "article":
      return <ArticleDetail slug={route.slug} />;
    case "gallery":
      return <GalleryPage />;
    case "about":
      return <HistoryPage />;
    default:
      return <NotFoundPage />;
  }
}

// Wrapper that renders the timetable section as a full page with header context
function TimetablePage() {
  return (
    <div className="pt-16 lg:pt-20">
      <Timetable />
    </div>
  );
}

// Contact as a standalone page (reuses the section with top padding)
function ContactStandalone() {
  return (
    <div className="pt-16 lg:pt-20">
      <ContactSection />
    </div>
  );
}

export function AppShell() {
  return (
    <RouterProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <RouteView />
        </main>
        <Footer />
        <CartDrawer />
        <ScrollUtilities />
        <ChatbotWidget />
      </div>
    </RouterProvider>
  );
}
