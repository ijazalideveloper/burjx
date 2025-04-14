import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Container from "../components/layout/Container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BURJX - Cryptocurrency Trading Platform",
  description: "Track and trade cryptocurrencies with real-time market data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-950 text-white min-h-screen`}
      >
        <Header />
        <main className="py-6">
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}
