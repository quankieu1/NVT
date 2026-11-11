import type { Metadata } from "next";
import { WEDDING_CONFIG } from "../data/wedding-config";
import "./globals.css";

export const metadata: Metadata = {
  title: WEDDING_CONFIG.seo.title,
  description: WEDDING_CONFIG.seo.description,
  openGraph: {
    title: `${WEDDING_CONFIG.couple.groom.shortName} & ${WEDDING_CONFIG.couple.bride.shortName}`,
    description: WEDDING_CONFIG.seo.description,
    siteName: WEDDING_CONFIG.seo.siteName,
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: WEDDING_CONFIG.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${WEDDING_CONFIG.couple.groom.shortName} & ${WEDDING_CONFIG.couple.bride.shortName}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${WEDDING_CONFIG.couple.groom.shortName} & ${WEDDING_CONFIG.couple.bride.shortName}`,
    description: WEDDING_CONFIG.seo.description,
    images: [WEDDING_CONFIG.seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      style={
        {
          "--font-cormorant": "'Cormorant Garamond', Georgia, serif",
          "--font-be-vietnam": "'Be Vietnam Pro', system-ui, sans-serif",
          "--font-dancing-script": "'Dancing Script', cursive",
        } as React.CSSProperties
      }
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Dancing+Script:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
