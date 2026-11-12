import type { Metadata } from "next";
import { Host_Grotesk, Libertinus_Sans } from "next/font/google";
import "./globals.css";

const host = Host_Grotesk({ subsets: ["latin"], variable: "--font-host" });
const libertinus = Libertinus_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-libertinus" });

export const metadata: Metadata = {
  title: "Explore China BD — Study and visas for China",
  description: "University admission, scholarships and Chinese visas (X1, X2, Z, M, L, Q, S) for students and families from Bangladesh.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${host.variable} ${libertinus.variable}`}>
      <body>{children}</body>
    </html>
  );
}
