import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import PublicShell from "@/components/layout/PublicShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Technician Ideas | Mobile Service • Stop By Service",
    template: "%s | Technician Ideas",
  },
  description:
    "Technician Ideas — professional photography collective. Mobile service and stop by service available.",
  keywords: ["photography", "technician ideas", "mobile service", "photo collective"],
  openGraph: {
    title: "Technician Ideas",
    description: "Professional photography collective. Mobile service • Stop by service.",
    siteName: "Technician Ideas",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-brand-white antialiased">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
