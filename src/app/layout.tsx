import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { LocalBusinessSchema, OrganizationSchema } from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutWrapper from "@/components/layout-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <LocalBusinessSchema />
          <OrganizationSchema />
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
