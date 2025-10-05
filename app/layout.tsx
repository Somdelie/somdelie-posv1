import type { Metadata } from "next";
import type React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/utils/Providers";
import { ThemeProvider } from "@/components/common/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Somdelie-Pos | Smart Point of Sale System",
    template: "%s | Somdelie-Pos",
  },
  description:
    "Somdelie-Pos is a modern, reliable Point of Sale system designed for businesses of all sizes. Manage sales, inventory, cashiers, reports, and customers with speed and precision.",
  keywords: [
    "POS system",
    "Somdelie-Pos",
    "Point of Sale",
    "inventory management",
    "cashier system",
    "sales reports",
    "retail software",
    "business management",
  ],
  authors: [{ name: "Somdelie Team" }],
  creator: "Somdelie",
  publisher: "Somdelie",
  applicationName: "Somdelie-Pos",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Somdelie-Pos | Smart Point of Sale System",
    description:
      "Fast, intuitive and powerful Point of Sale software for managing sales, inventory, customers, and reports.",
    url: "https://yourdomain.com",
    siteName: "Somdelie-Pos",
    locale: "en_US",
    type: "website",
  },
  category: "business",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
