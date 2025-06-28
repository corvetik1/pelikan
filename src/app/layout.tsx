import type { Metadata } from "next";
import Providers from "@/providers/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Меридиан — Рыбная компания",
  description: "Корпоративный сайт рыбной компании Меридиан",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />{children}          <Footer />
        </Providers>
      </body>
    </html>
  );
}
