import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import "./globals.css";
import "driver.js/dist/driver.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import GoogleAnalytics from "@/components/google-analytics";

const fontPoppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const fontPTSans = PT_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

export const metadata: Metadata = {
  title: {
    default: "SmartTulna",
    template: "%s | SmartTulna",
  },
  description: "The smartest way to compare products. SmartTulna lets you compare any two products, side-by-side, based on online and local prices.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
    },
  },
  appleWebApp: {
    title: "SmartTulna",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          fontPoppins.variable,
          fontPTSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
