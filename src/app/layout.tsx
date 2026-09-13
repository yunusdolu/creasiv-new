import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://creasiv.com";
const siteTitle = "Creasiv — Dijital Tasarım, Yazılım & Medya Ajansı";
const siteDescription =
  "Creasiv; web & yazılım geliştirme, logo ve kurumsal kimlik tasarımı, 8K drone çekimi ve video prodüksiyonunu tek çatı altında sunan dijital kreatif ajans.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Creasiv",
  keywords: [
    "Creasiv",
    "dijital ajans",
    "web tasarım",
    "yazılım geliştirme",
    "e-ticaret sitesi",
    "logo tasarımı",
    "kurumsal kimlik",
    "ambalaj tasarımı",
    "drone çekimi",
    "tanıtım filmi",
    "video prodüksiyon",
  ],
  authors: [{ name: "Creasiv", url: siteUrl }],
  creator: "Creasiv",
  publisher: "Creasiv",
  category: "Dijital Ajans",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
  // og:image ve twitter:image, app/opengraph-image.png ve app/twitter-image.png dosyalarından otomatik gelir.
  // Favicon'lar app/favicon.ico, app/icon.png ve app/apple-icon.png dosyalarından otomatik gelir.
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Creasiv",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#1A3DE8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Creasiv",
      alternateName: "Creasiv Dijital Ajans",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/logo-square.png`,
      image: `${siteUrl}/opengraph-image.png`,
      description: siteDescription,
      email: "creasivcom@gmail.com",
      sameAs: ["https://instagram.com/creasivcom"],
      areaServed: { "@type": "Country", name: "Türkiye" },
      knowsLanguage: ["tr"],
      knowsAbout: [
        "Web tasarım",
        "Yazılım geliştirme",
        "E-ticaret",
        "SEO",
        "Logo tasarımı",
        "Kurumsal kimlik",
        "Ambalaj tasarımı",
        "Drone çekimi",
        "Video prodüksiyon",
        "Motion graphics",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "creasivcom@gmail.com",
        availableLanguage: ["Turkish"],
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Creasiv Hizmetleri",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Yazılım Çözümleri",
            itemListElement: [
              "Kurumsal web sitesi",
              "E-ticaret sitesi",
              "Landing page",
              "Web uygulaması (SaaS, CRM, yönetim paneli)",
              "SEO ve site hızı optimizasyonu",
              "Bulut altyapı ve API entegrasyonu",
            ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
          },
          {
            "@type": "OfferCatalog",
            name: "Tasarım Çözümleri",
            itemListElement: [
              "Logo tasarımı",
              "Kurumsal kimlik tasarımı",
              "Sosyal medya ve dijital reklam tasarımı",
              "Ambalaj ve etiket tasarımı",
              "Katalog, broşür ve baskı tasarımı",
              "UI tasarım sistemi",
            ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
          },
          {
            "@type": "OfferCatalog",
            name: "Prodüksiyon Çözümleri",
            itemListElement: [
              "8K drone ve FPV çekimi",
              "Kurumsal tanıtım filmi",
              "Mekan ve mimari çekim",
              "Stüdyo ve ürün çekimi",
              "Kurgu ve renk düzenleme",
              "Motion graphics ve VFX",
            ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
          },
        ],
      },
    },
    {
      // Google arama sonuçlarındaki site adı bu kayıttan okunur (domain yerine "Creasiv" görünmesi için)
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Creasiv",
      alternateName: ["Creasiv Dijital Ajans", "Creasiv Ajans"],
      inLanguage: "tr-TR",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased selection:bg-[#fd5200] selection:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
