import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/structured-data";
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
  title: "Cherdung Café - Delicious Food & Great Atmosphere",
  description: "Welcome to Cherdung Café, your neighborhood destination for specialty coffee, delicious food, and memorable experiences.",
  keywords: ["cafe", "coffee", "restaurant", "dine-in", "takeaway", "catering", "atmosphere"],
  openGraph: {
    title: "Cherdung Café - Delicious Food & Great Atmosphere",
    description: "Your neighborhood café serving specialty coffee, delicious food, and memorable experiences.",
    type: "website",
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
            <LayoutWrapper>{children}</LayoutWrapper>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
