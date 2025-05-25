import type { Metadata } from "next";
import { Poppins, Inter, DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Import components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

// Font configurations
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Bali Malayali - Premium Bali Experiences",
  description: "Premium Bali experiences, curated by people who understand you.",
  keywords: ["Bali", "Travel", "Tourism", "Packages", "Activities", "Experiences", "Honeymoon", "Luxury"],
  authors: [{ name: "Bali Malayali" }],
  creator: "Bali Malayali",
  publisher: "Bali Malayali",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${poppins.variable} ${inter.variable} ${dmSans.variable} text-base antialiased`}>
        <Providers>
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            <Header />
            <main className="flex-grow w-full">{children}</main>
            <Footer />
            <WhatsAppButton />
          </div>
        </Providers>
      </body>
    </html>
  );
}
