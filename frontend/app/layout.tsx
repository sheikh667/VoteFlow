import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoteFlow AI",
  description: "Secure Voting with Face Recognition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* THIS IS THE MAGIC LINE - FORCE LOADS TAILWIND */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}