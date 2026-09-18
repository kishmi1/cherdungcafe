import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { LocalBusinessSchema, OrganizationSchema, WebSiteSchema } from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout-wrapper";
import { CartProvider } from "@/lib/cart-context";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cherdungcafe.vercel.app"),
  title: {
    default: "Cherdung Café | Coffee, Food & Dining in Kathmandu",
    template: "%s | Cherdung Café"
  },
  description: "Cherdung Café in Sankhamul, Kathmandu — enjoy coffee, delicious food, fresh meals, offers, and a warm place to dine, relax and connect.",
  keywords: ["Cherdung Café", "Cherdung Cafe Kathmandu", "cafe in Kathmandu", "cafe in Sankhamul", "coffee in Kathmandu", "food in Kathmandu", "restaurant in Sankhamul", "coffee and food", "online food ordering", "table reservation", "Kathmandu cafe"],
  applicationName: "Cherdung Café",
  authors: [{ name: "Cherdung Café" }],
  creator: "Cherdung Café",
  publisher: "Cherdung Café",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://cherdungcafe.vercel.app",
  },
  openGraph: {
    type: "website",
    siteName: "Cherdung Café",
    title: "Cherdung Café | Coffee, Food & Dining in Kathmandu",
    description: "Cherdung Café in Sankhamul, Kathmandu — enjoy coffee, delicious food, fresh meals, offers, and a warm place to dine, relax and connect.",
    url: "https://cherdungcafe.vercel.app",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Cherdung Café - Coffee, Food & Dining in Kathmandu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cherdung Café | Coffee, Food & Dining in Kathmandu",
    description: "Cherdung Café in Sankhamul, Kathmandu — enjoy coffee, delicious food, fresh meals, offers, and a warm place to dine, relax and connect.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <CartProvider>
            <LocalBusinessSchema />
            <OrganizationSchema />
            <WebSiteSchema />
            <LayoutWrapper>{children}</LayoutWrapper>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
